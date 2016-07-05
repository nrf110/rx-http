const { Http } = require('../dist/rx-http');

describe('sample', () => {
  it('should always succeed', (done) => {
    console.log(Http);

    let client = new Http();

    client.get('/text')
      .execute()
      .response
      .subscribe((response) => {
        expect(response.body()).to.be('Hello');
        done();
      });
  })
});
