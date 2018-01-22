import { Http } from '../../lib/rx-http';

describe('request', () => {
  it('should always succeed', (next) => {
    const client = new Http();
    const request = client.get('http://localhost:3000/text')
      .headers('Accept', 'text/plain');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Hello');
        next();
      });
  });

  it('should maybe succeed', (next) => {
    const client = new Http();
    const request = client.post('http://localhost:3000/text')
      .headers('Content-Type', 'text/plain')
      .headers('Accept', 'text/plain')
      .body('Test!');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Test!');
        next();
      });
  });
});
