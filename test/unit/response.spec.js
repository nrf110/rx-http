import Response from '../../src/response';
import PropertyBehaviors from './property-behaviors';
import Rx from 'rxjs';

const behaviors = new PropertyBehaviors(Response);
const properties = {
  status: 200,
  statusText: 'OK',
  headers: { 'Content-Type': 'application/json', 'X-Custom-Header': 'Value' },
  body: new Rx.Subject(),
  uploadProgress: new Rx.Subject(),
  downloadProgress: new Rx.Subject()
};
const response = new Response(properties);

describe('status', () => {
  it('should return the status', (next) => {
    expect(response.status()).to.equal(properties.status);
    next();
  });
});

describe('statusText', () => {
  it('should return the statusText', (next) => {
    expect(response.statusText()).to.equal(properties.statusText);
    next();
  });
});

describe('body', () => {
  it('should return the body', (next) => {
    expect(response.body()).to.equal(properties.body);
    next();
  });
});

describe('uploadProgress', () => {
  it('should return the uploadProgress', (next) => {
    expect(response.uploadProgress()).to.equal(properties.uploadProgress);
    next();
  });
});

describe('downloadProgress', () => {
  it('should return the downloadProgress', (next) => {
    expect(response.downloadProgress()).to.equal(properties.downloadProgress);
    next();
  });
});

describe('headers', () => {
  it('should return a hash of all response headers', (next) => {
    const headers = response.headers();
    expect(headers).to.deep.equal({ 'Content-Type': 'application/json', 'X-Custom-Header': 'Value' });
    next();
  });

  it('should return the value of the requested header', (next) => {
    expect(response.headers('content-type')).to.equal('application/json');
    next();
  });
});
