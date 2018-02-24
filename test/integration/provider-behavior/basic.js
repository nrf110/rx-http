import { Http } from '../../../lib/rx-http';

export default function basicBehavior(provider) {
  it('successfully execute a simple GET', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://localhost:3000/text')
      .headers('Accept', 'text/plain');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Hello');
        next();
      });
  });

  it('successfully execute a simple POST', (next) => {
    const client = new Http({ provider });
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

  // TODO json
  // TODO xml
};
