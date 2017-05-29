import { partial, isInteger } from 'lodash';
import Rx from 'rxjs';
import XHRBuilder from './xhr-builder';
import Response from './response';
import { RequestInterceptorChain, ResponseInterceptorChain } from './interceptors';

export default function XHRProvider(request) {
  const interceptors = request.interceptors();

  function attempt(observable, retries = request.retries()) {
    let response;
    let offset = 0;
    let body = new Rx.Subject();
    let uploadProgress = new Rx.Subject();
    let downloadProgress = new Rx.Subject();
    let all = [observable, body, uploadProgress, downloadProgress];

    function errorAll(err) {
      all.forEach(o => o.error(err));
    }

    function completeAll() {
      all.forEach(o => o.complete());
    }

    function exceptionHandler(evt) {
      if (retries > 0) attempt(observable, retries - 1);
      else errorAll(evt);
    }

    function nextChunk() {
      console.log('called nextChunk')
      let chunk = xhr.responseText.slice(offset);
      offset = xhr.responseText.length;
      body.next(chunk);
    }

    const xhr = new XHRBuilder()
      .request(request)
      .onHeadersReceived((evt) => {
        response = new Response(
          xhr,
          body,
          uploadProgress,
          downloadProgress
        );

        const responseChain = new ResponseInterceptorChain(
          interceptors,
          (transformedResponse) => observable.next(transformedResponse),
          exceptionHandler
        );

        responseChain.run(response);
      })
      .onUploadProgress(uploadProgress.next)
      .onDownloadProgress((evt) => {
        downloadProgress.next(evt);
        if (response.isChunked()) {
          nextChunk();
        }
      })
      .onLoad((evt) => {
        if (response.isChunked()) {
          if (xhr.responseText.length > offset) {
            nextChunk();
          }
        } else {
          body.next(xhr.responseText);
        }
      })
      .onError(exceptionHandler)
      .onAbort(exceptionHandler)
      .onLoadEnd(completeAll)
      .build();

    const success = transformed => {
      if (!!transformed.body()) xhr.send(transformed.body());
      else xhr.send();
    };

    const requestChain = new RequestInterceptorChain(
      interceptors,
      success,
      (err) => {
        observable.error(err);
        completeAll();
      }
    );

    requestChain.run(request);
  }

  return Rx.Observable.create(attempt);
}
