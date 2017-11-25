import { Http } from '../lib/rx-http';

describe('sample', () => {
  it('should always succeed', (done) => {
    const client = new Http();
    const request = client.get('http://localhost:3000/text')
      .header('Accept', 'text/plain');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Hello');
        done();
      });
  });

  it('should maybe succeed', (done) => {
    const client = new Http();
    const request = client.post('http://localhost:3000/text')
      .header('Content-Type', 'text/plain')
      .header('Accept', 'text/plain')
      .body('Test!');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Test!');
        done();
      });
  });
});
