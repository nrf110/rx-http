import { Http } from '../../../lib/rx-http';

export default function progressBehavior(provider) {
  it('should report progress during a file upload', (next) => {
    const client = new Http({ provider });
    const stringData = "123456789.".repeat(1000000);
    const formData = new FormData();
    formData.append(
      'sample',
      new Blob([stringData], { type: 'text/plain' }),
      'sample.txt'
    );

    const request = client.post('/test/upload')
      .headers('Accept', 'text/plain')
      .body(formData);

    const uploadProgressEvents = [];
    request.uploadProgress()
      .subscribe((evt) => {
        uploadProgressEvents.push(evt);
      });

    request.execute()
      .subscribe((response) => {
        const body = response.body();
        body.subscribe((result) => {
          expect(uploadProgressEvents).to.have.length.greaterThan(2);
          expect(result).to.equal('OK');
          next();
        });
      })
  });

  it('should report progress during a download', (next) => {
    const client = new Http({ provider });
    const request = client.get('/test/chunked')
      .headers('Accept', 'application/json');

    request.execute()
      .flatMap((response) => response.downloadProgress())
      .reduce((accum, evt) => {
        accum.push(evt);
        return accum;
      }, [])
      .subscribe((events) => {
        expect(events).to.have.length.greaterThan(2);
        next();
      });
  });
};
