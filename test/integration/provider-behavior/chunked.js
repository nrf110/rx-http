import { Http } from '../../../lib/rx-http';

export default function chunkedBehavior(provider) {
  it("should stream individual chunks from the response", (next) => {
    const client = new Http({ provider });
    const request = client.get('/test/chunked')
      .headers('Accept', 'application/json');

    request.execute()
      .flatMap((response) => response.body())
      .reduce((accum, chunk) => {
        accum.push(JSON.parse(chunk));
        return accum;
      }, [])
      .subscribe((chunks) => {
        expect(chunks).to.have.deep.members([{ a: 3 }, { a: 2 }, { a: 1}]);
        next();
      });
  });
};
