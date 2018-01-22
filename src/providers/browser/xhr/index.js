import { partial, isInteger } from 'lodash';
import Rx from 'rxjs';
import XHRBuilder from './xhr-builder';
import Response from '../../../response';
import RequestInterceptorChain from '../../../request-interceptor-chain';
import ResponseInterceptorChain from '../../../response-interceptor-chain';

/** @function
 * Provider-implementation for browser-based clients.  Providers are simply
 * functions that take in a {@link Request} and return an RxJS Observable
 * that eventually contains the {@link Response}.
 * @name XHRProvider
 * @param {Request} request
 * @returns {Observable<Response>}
 */
export default function XHRProvider(request) {
  const interceptors = request.interceptors();

  function attempt(observable) {
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

    function nextChunk() {
      let chunk = xhr.responseText.slice(offset);
      offset = xhr.responseText.length;
      body.next(chunk);
    }

    const xhr = new XHRBuilder()
      .request(request)
      .onHeadersReceived((evt) => {
        response = new Response({
          xhr,
          body,
          uploadProgress,
          downloadProgress
        });

        const responseChain = new ResponseInterceptorChain(
          interceptors,
          (transformedResponse) => observable.next(transformedResponse),
          Rx.Observable.throw
        );

        responseChain.run(response);
      })
      .onUploadProgress((evt) => {
        uploadProgress.next(evt);
      })
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
      .onError(Rx.Observable.throw)
      .onAbort(errorAll)
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
        Rx.Observable.throw(err);
        completeAll();
      }
    );

    requestChain.run(request);
  }

  return Rx.Observable.create(attempt);
}