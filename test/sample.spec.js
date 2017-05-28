import { Http } from '../lib/rx-http';

describe('sample', () => {
  it('should always succeed', (done) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (evt) => {
      console.log(evt);
      done();
    });
    xhr.addEventListener('error', (evt) => {
      console.log('failed');
      console.log(xhr.status);
      done();
    });
    xhr.open('GET', 'http://localhost:3000/text');
    xhr.send();

    // let client = new Http();
    // client
    //   .baseUrl('http://localhost:3000')
    //   .get('/text')
    //   .execute()
    //   .subscribe((response) => {
    //     console.log(response.body());
    //     expect(response.body().to.be('Hello'));
    //     done();
    //   });
  });
});
