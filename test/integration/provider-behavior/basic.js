import { Http } from '../../../lib/rx-http';

export default function basicBehavior(provider) {
  it('successfully execute a text GET', (next) => {
    const client = new Http({ provider });
    const request = client.get('/test/text')
      .headers('Accept', 'text/plain');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(body).to.equal('Hello');
        next();
      });
  });

  it('successfully execute a text POST', (next) => {
    const client = new Http({ provider });
    const request = client.post('/test/text')
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

  it('successfully execute a JSON GET', (next) => {
    const client = new Http({ provider });
    const request = client.get('/test/json')
      .headers('Accept', 'text/json');

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(JSON.parse(body)).to.deep.equal({ message: "Hello" });
        next();
      });
  });

  it('successfully execute a JSON POST', (next) => {
    const client = new Http({ provider });
    const request = client.post('/test/json')
      .headers('Content-Type', 'application/json')
      .headers('Accept', 'application/json')
      .body({ foo: "bar" });

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((body) => {
        expect(JSON.parse(body)).to.deep.equal({ foo: "bar" });
        next();
      });
  });
};
