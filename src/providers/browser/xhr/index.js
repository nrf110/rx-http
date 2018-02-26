import { partial, isInteger } from 'lodash';
import Rx from 'rxjs';
import XHRBuilder from './xhr-builder';
import Response from '../../../response';
import RequestInterceptorChain from '../../../request-interceptor-chain';
import ResponseInterceptorChain from '../../../response-interceptor-chain';
import { parseHeaders } from '../../../utilities';

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
    let uploadProgress = request.uploadProgress();
    let downloadProgress = new Rx.BehaviorSubject({ loaded: 0, total: 0 });
    let all = [observable, body, uploadProgress, downloadProgress];
    let failed = false;

    function responseError(err) {
      observable.error(err);
      body.complete();
      uploadProgress.complete();
      downloadProgress.complete();
    }

    function completeAll() {
      all.forEach(o => o.complete());
    }

    function errorAll(err) {
      all.forEach(o => o.error(err));
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
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders()),
          body,
          uploadProgress,
          downloadProgress
        });

        const responseChain = new ResponseInterceptorChain(
          interceptors,
          (transformedResponse) => {
            observable.next(transformedResponse)
          },
          (transformedResponse) => {
            failed = true;
            responseError(transformedResponse);
          }
        );

        responseChain.run(response);
      })
      .onUploadProgress((evt) => {
        uploadProgress.next({ loaded: evt.loaded, total: evt.total });
      })
      .onDownloadProgress((evt) => {
        downloadProgress.next({ loaded: evt.loaded, total: evt.total });
        if (response.isChunked()) {
          nextChunk();
        }
      })
      .onLoad((evt) => {
        if (!failed) {
          if (response.isChunked()) {
            if (xhr.responseText.length > offset) {
              nextChunk();
            }
          } else {
            body.next(xhr.responseText);
          }
        }
      })
      .onError(responseError)
      .onAbort(errorAll)
      .onLoadEnd(() => {
        if (!failed) {
          completeAll()
        }
      })
      .build();

    const success = transformed => {
      try {
        if (!!transformed.body()) xhr.send(transformed.body());
        else xhr.send();
      } catch (err) {
        responseError(err);
      }
    };

    const requestChain = new RequestInterceptorChain(
      interceptors,
      success,
      responseError
    );

    requestChain.run(request);
  }

  return Rx.Observable.create(attempt);
}
