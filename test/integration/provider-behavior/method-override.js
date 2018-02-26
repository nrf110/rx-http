import { Http } from '../../../lib/rx-http';

export default function methodOverrideBehavior(provider) {
  it("should route a PATCH request to the appropriate endpoint", (next) => {
    const client = new Http({ provider });
    const requestBody = "Hello";
    const request = client.patch('/test/patch')
      .headers('Content-Type', 'text/plain')
      .headers('Accept', 'text/plain')
      .body(requestBody);

    request.execute()
      .flatMap((response) => response.body())
      .subscribe((responseBody) => {
        expect(responseBody).to.equal(requestBody);
        next();
      });
  });
};
