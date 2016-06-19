function XHRProvider(request) {
  function registerEvents(xhr, observable, retries) {

    function progressHandler(type, evt) {
      observable.onNext({ type, progress: evt });
    }

    function exceptionHandler(evt) {
      if (retries > 0) {
        attempt(observable, retries - 1);
      } else {
        observable.onError(evt);
        observable.onCompleted();
      }
    }

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', _.partial(progressHandler, HTTP_EVENTS.UPLOAD_PROGRESS));
      xhr.upload.addEventListener('error', exceptionHandler);
      xhr.upload.addEventListener('abort', exceptionHandler);
    }

    xhr.addEventListener('progress', _.partial(progressHandler, HTTP_EVENTS.DOWNLOAD_PROGRESS));
    xhr.addEventListener('error', exceptionHandler);
    xhr.addEventListener('abort', exceptionHandler);
    xhr.addEventListener('load', (evt) => {
      const response = new Response(xhr);
      const interceptors = request.interceptors();
      const successHandler = function(transformed) {
        observable.onNext({ type: HTTP_EVENTS.RESPONSE_RECEIVED, response: transformed});
      }

      new ResponseInterceptorChain(interceptors, successHandler, exceptionHandler)
        .run(response);
    });

  }

  function attempt(observable, remaining = request.retries()) {
    const xhr = new window.XmlHTTPRequest();
    registerEvents(xhr, observable, remaining);

    xhr.open(request.method(), request.url());

    if (_.isInteger(request.timeout())) {
      xhr.timeout = request.timeout();
    }

    const headers = request.headers();
    Object.keys(headers).forEach((headerName) => {
      xhr.setRequestHeader(headerName, headers[headerName]);
    });

    // TODO: consider dealing with xhr.responseType
    const interceptors = request.interceptors();
    const success = (transformed) => xhr.send(transformed.body());
    const failure = (error) => {
      observable.onError(error);
      observable.onCompleted();
    }
    new RequestInterceptorChain(interceptors, success, failure)
      .run(request);
  }

  const stream = Rx.Observable.create(attempt).share();

  const uploadProgress = stream
    .filter(evt => evt.type === HTTP_EVENTS.UPLOAD_PROGRESS)
    .map(evt => evt.progress);

  const downloadProgress = stream
    .filter(evt => evt.type === HTTP_EVENTS.DOWNLOAD_PROGRESS)
    .map(evt => evt.progress);

  const response = stream
    .filter(evt => evt.type === HTTP_EVENTS.RESPONSE_RECEIVED)
    .map(evt => evt.response);

  return {
    uploadProgress,
    downloadProgress,
    response
  };
}
