import { Http } from '../../../lib/rx-http';

export default function authBehavior(provider) {
  it('should send successfully authenticate with basic auth credentials', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://localhost:3000/auth')
      .user('admin')
      .password('supersecret');

    request.execute()
      .subscribe((response) => {
        expect(response.status()).to.equal(200);
        next();
      });
  });

  it('should successfully authenticate with basic auth credentials in the url', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://admin:supersecret@localhost:3000/auth');

    request.execute()
      .subscribe((response) => {
        expect(response.status()).to.equal(200);
        next();
      });
  });

  it('should receive a 401 response with invalid credentials', (next) => {
    const client = new Http({ provider });
    const request = client.get('http://localhost:3000/auth')
      .user('admin')
      .password('wrong');

    request.execute()
      .subscribe(
        (response) => {
          expect.fail(response, null, 'Expected request to fail');
          next();
        },
        (response) => {
          expect(response.status()).to.equal(401);
          next();
        }
      );
  });
};
