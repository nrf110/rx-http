# Rx-HTTP

Rx-HTTP is an HTTP library designed for native interoperability with
[RxJS](https://github.com/Reactive-Extensions/RxJS).

*This library is still in early development.  It is not yet finished, tested, documented, nor anywhere near production-ready.*

## Features
- Simple builder pattern for requests
- Progress reporting of both uploads and downloads
- RxJS-style transformations, and easy composition with other RxJS observables
- Works with CommonJS, AMD, and ES6-style module loaders

## Installation
npm:

`npm install rx-js`


bower:

`bower install rx-js`

## Browser Support - Based on XmlHTTPRequest browser compatibility matrix.
- IE 10+
- Chrome 31+ - Tested against Chrome 50
- Firefox 20+ - Tested against Firefox 45

## Basic Usage
```javascript
import Http from 'rx-http';

const request = Http.post('http://example.com/my/path')
  .header('Content-Type', 'application/json')
  .header('Accept', 'application/json')
  .body({ "foo": "bar"})
  .timeout(5000)
  .retries(3)
  .build()

const streams = request.execute();

streams.downloadProgress
  .subscribe((progress) => console.log('Received progress'));

streams.uploadProgress
  .subscribe((progress) => console.log('Received progress'));

streams.response
  .filter((response) => response.status() === 200)
  .map((response) => response.body())
  .subscribe(
    ((body) => console.log(body)),
    ((err) => console.log('Oops')),
    (() => console.log('done'))
  );
```