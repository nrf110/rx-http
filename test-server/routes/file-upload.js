const formidable  = require('formidable'),
      path        = require('path');

module.exports = function(app) {
  app.post('/upload', (request, response) => {
    response.setHeader('Content-Type', 'text/plain');

    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '..', 'uploads');
    form.multiples = true;

    form.parse(request, (err, fields, files) => {
      response.send('OK');
    });
  });
};
