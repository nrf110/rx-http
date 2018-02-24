import { Http, Errors } from '../../../lib/rx-http';

export default function errorBehavior(provider) {
  it('should send a non-20x response to the error function', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://localhost:3000/error');

    request.execute()
      .subscribe(
        (response) => {
          expect.fail(response, null, 'Expected request to fail');
          next();
        },
        (response) => {
          expect(response.status()).to.equal(400);
          next();
        }
      );
  });

  it('should send a connection error to the error function', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://thisisabadurl.com');

    request.execute()
      .subscribe(
        (response) => {
          expect.fail(response, null, 'Expected request to fail');
          next();
        },
        (error) => {
          expect(error).to.be.an.instanceof(Errors.ConnectionError);
          next();
        }
      );
  });

  it('should retry a failed request the specified number of times', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://localhost:3000/retry');

    request.execute()
      .retry(2)
      .subscribe((response) => {
        response.body().subscribe((body) => {
          expect(body).to.equal('2');
          next();
        });
      });
  });
};
