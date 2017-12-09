# Rx-HTTP

Rx-HTTP is an HTTP library designed for native interoperability with
[RxJS](https://github.com/Reactive-Extensions/RxJS).

*This library is still in beta, and probably shouldn't be used in production yet.  The API should be (mostly) stable and the first round of features has been implemented, but it is still light on tests*

## Features
- Simple builder pattern for requests
- Progress reporting of both uploads and downloads
- RxJS-style transformations, and easy composition with other RxJS observables
- Works with CommonJS, AMD, and ES6-style module loaders

## Installation
npm:

`npm install rx-http`


bower (not yet tested):

`bower install rx-http`

## Browser Support - Based on XmlHTTPRequest browser compatibility matrix.
- IE 10+
- Chrome 31+ - Tested against Chrome 50
- Firefox 20+ - Tested against Firefox 45

# Table of Contents
- [Basic Usage](#basic-usage)

## Basic Usage
```javascript
import { Http } from 'rx-http';

const client = new Http();

client.post('http://example.com/my/path')
  .header('Content-Type', 'application/json')
  .header('Accept', 'application/json')
  .body({ "foo": "bar"})
  .timeout(5000)
  .execute()
  .subscribe((response) => {
    response.downloadProgress()
      .subscribe((progress) => console.log('Received progress'));

    response.uploadProgress()
      .subscribe((progress) => console.log('Received progress'));

    response.body()
      .subscribe((body) => console.log(body));
  });
```

## The HTTP Client
The [Http](class/src/http.js~Http.html) class is a client instance that is used to create [Request](class/src/request.js~Request.html) objects.  Requests created by a client instance
inherit the settings of that instance as defaults, which can be overridden
on the request.

```javascript
import { Http } from 'rx-http';

const client = new Http({ baseUrl: '/users' });

const request = client.request('/123', {
  method: 'GET',
  query: {'key': 'value' },
  headers: { 'Accept': 'application/json' }
})

request.execute().subscribe((response) => {
  // do something with the response
});
```

The Http client provides convenience methods for each of the HTTP verbs (GET, POST, PUT, PATCH, DELETE, HEAD, TRACE, and OPTIONS), in addition to the raw `request` method.
```javascript
new Http().post('/some/path', { body: { 'key', 'value' } })
  .execute()
  .subscribe((response) => ...));
```

## Interceptors
Interceptors provide reusable logic for validation, error-handling and recovery, enrichment, and transformation of requests and responses.

Interceptors implement 4 methods (the [Interceptor]() base class provides default implementations that can be overridden):

### request - enrich/transform and/or validate an outgoing request.
```javascript
import { Interceptor } from 'rx-http';
class MyRequestInterceptor extends Interceptor {
  request(req, accept, reject) {
    // Add a custom header on a same-domain request
    if (req.url().isRelative()) {
      accept(request.header('X-Custom-Header', 'value'));
    } else {
      // Don't allow cross-domain requests
      reject({ message: 'Cross domain not allowed', request: req });
    }
  }
}

new Http().addInterceptor(new MyRequestInterceptor());
```

### requestError - recover from a request rejection
```javascript
import { Interceptor } from 'rx-http';
class MyRequestErrorInterceptor extends Interceptor {
  requestError(err, accept, reject) {
    // Do something to fix the request
    //.
    //.
    //.
    accept(err.req)
  }
}

new Http().addInterceptor(new MyRequestErrorInterceptor());
```

### response - enrich/transform and/or validate an incoming response.
```javascript
class MyResponseInterceptor extends Interceptor {
  response(res, accept, reject) {
    // Enrich the response
    const headerValue = res.header('X-Custom-Header')
    if (!!headerValue) {
      res.customThing = headerValue;
      accept(res);
    } else {
      reject({ message: 'Missing special header!', req: res);
    }   
  }
}
```

### responseError - recover from a response rejection
```javascript
class MyResponseErrorInterceptor extends Interceptor {
  responseError(err, accept, reject) {
    // We were expecting the resource not to exist, don't fail.
    if (err.res.status() === 404) {
      accept(err.res);
    }   
  }
}
```

The `request` method is run, on outgoing requests, for each interceptor until all interceptors are run, or a request is rejected.  In the event of a rejection, the `requestError` method is tried on each interceptor.  If any of the `requestError` methods is able to repair the request, the interceptor chain will resume from where it left off, using the repaired request.

The idea works similarly with `response` and `responseError` for incoming responses.

### Built-in Interceptors
* **BodyTransformer** - serializes the request body using the given or default serializer.  The serializer may also specify the value of the Content-Type header here, if it is not already specified by the request.
* **ErrorHandling** - response interceptor that rejects non 20x status requests.
* **MethodOverride** - request interceptor that converts HTTP verbs (GET, PUT, POST, PATCH, DELETE, etc...) into ones that the browser understands (GET and POST), and puts the original verb in the X-HTTP-Method-Override header for the server to use to route the request as intended.
* **XSRF** - reads the specified cookie containing the XSRF token, and places it in the specified custom header to send back to the server.

## Request Body
The `body([value, [serializer]])` method allows setting the request body.  The `value` may be a File, Blob, Object, or String.  An instance of a Serializer implementation may be provided here to serialize the data before it is sent to the server.  If no serializer is provided, Serializers.Default will be used.  This serializer attempts to automatically determine the correct built-in Serializer implementation and delegate to it.  If no appropriate implementation is found, it will throw a NoSerializerFoundException.

## Response Body
The [Response](class/src/request.js~Request.html) body is itself an RxJS Observable.  For a non-chunked response, it will produce exactly 1 element.  For chunked responses, it will emit each chunk by default.  Response Interceptors can be used to transform chunked or non-chunked response bodies before they are consumed by the body Observable.

```javascript
const client = new Http();
client.get('/widgets/123')
  .flatMap((response) => response.body())
  .subscribe((widget) => console.log(user));
```
## XSRF
XSRF Support is provided by the XSRF Interceptor, which is applied by default.  The Interceptor will read the value from the server-sent XSRF Cookie and send it back in a header.  The default cookie and header names are XSRF-Token and X-XSRF-TOKEN, respectively.  These names can be configured on either the Http instance or a Request instance via the xsrfCookieName and xsrfHeaderName methods.
```javascript
import { Http, Interceptors } from 'rx-http';

const client = new Http()
  .addInterceptor(Interceptors.XSRF) // this isn't needed unless you remove the default interceptors
  .xsrfCookieName('CSRF-Token')
  .xsrfHeaderName('X-CSRF-TOKEN');

// override at the request level
client.xsrfCookieName('OTHER-TOKEN')
  .execute()
  .subscribe(...)
```

## Timeouts
You can set the request timeout using the `timeout` method on the Http client or on an individual Request.
```javascript
import { Http } from 'rx-http';

const client = new Http()
  .timeout(3000);

client.get('/some/url')
  .timeout(5000)
  .execute()
  .subscribe(...);
```

## Progress Tracking
Upload and Download progress can be tracked as additional RxJS Observables on the response object.  These observables currently emit the native browser events.  This may be abstracted in the future for more consistency across browsers, as well as Node.js.
```javascript
import { Http } from 'rx-http';

const client = new Http();

client.post('http://example.com/my/path')
  .header('Content-Type', 'application/json')
  .header('Accept', 'application/json')
  .body({ "foo": "bar"})
  .timeout(5000)
  .execute()
  .subscribe((response) => {
    response.downloadProgress()
      .subscribe((progress) => console.log('Received progress'));

    response.uploadProgress()
      .subscribe((progress) => console.log('Received progress'));

    response.body()
      .subscribe((body) => console.log(body));
  });
```

## Authentication
Basic auth username, password, and withCredentials
properties are exposed on both the client and on individual request objects.

```javascript
import { Http } from 'rx-http';

// Apply basic auth credentials to all Requests
const client = new Http()
  .username('user')
  .password('password1');

// Override credentials for just this request.
const req = client.get('/some/path')
  .withCredentials(true);
  .username('admin')
  .password('supersecret!')

req.execute().subscribe(...)
```

## Cookies
rx-http requires [js-cookie](https://github.com/js-cookie/js-cookie) as a peer-dependency, primarily for use in the XSRF interceptor.

# Contributing
* I would be happy to accept core contributors who have time to help maintain this project.
* Report bugs - use the issues link and submit issues.  I can't fix it if I don't know about it.
* Submit PRs with test/automation - make it more robust and useable!
* Feature requests/bugfixes - if you would like to submit ideas or PRs for enhancements, please first open an issue for discussion, with the tag 'enhancements'.
