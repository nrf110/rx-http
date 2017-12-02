# Rx-HTTP

Rx-HTTP is an HTTP library designed for native interoperability with
[RxJS](https://github.com/Reactive-Extensions/RxJS).

*This library is still in beta, and probably shouldn't be used in production yet.  The API should be (mostly) stable and the first round of features has been implemented, but it is still light on tests and documentation.*

## Features
- Simple builder pattern for requests
- Progress reporting of both uploads and downloads
- RxJS-style transformations, and easy composition with other RxJS observables
- Works with CommonJS, AMD, and ES6-style module loaders

## Installation
npm:

`npm install rx-http`


bower:

`bower install rx-http`

## Browser Support - Based on XmlHTTPRequest browser compatibility matrix.
- IE 10+
- Chrome 31+ - Tested against Chrome 50
- Firefox 20+ - Tested against Firefox 45

## Basic Usage
```javascript
import { Http } from 'rx-http';

const client = new Http();

client.post('http://example.com/my/path')
  .header('Content-Type', 'application/json')
  .header('Accept', 'application/json')
  .body({ "foo": "bar"})
  .timeout(5000)
  .retries(3)
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
