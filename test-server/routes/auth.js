const auth = require('basic-auth');
const util = require('util');

module.exports = function(app) {
  app.get('/auth', (request, response) => {
    const credentials = auth.parse(request.get('Authorization'));

    if (credentials && credentials.name === 'admin' && credentials.pass === 'supersecret') {
      response.status(200);
      response.send();
    } else {
      response.status(401);
      response.send();
    }
  });
};
