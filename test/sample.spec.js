import { Http } from '../lib/rx-http';

describe('sample', () => {
  it('should always succeed', (done) => {
    const client = new Http();
    const request = client.get('http://localhost:3000/text');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Hello');
        done();
      });
  });
});
