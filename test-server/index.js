const Express = require('express'),
      routes  = require('./routes'),
      app     = Express();

var server;

class TestServer {
  constructor() {
    routes(app);
  }

  start() {
    server = app.listen(3000, () => {
      console.log('Test app started on port 3000');
    });
  }

  stop() {
    console.log('Test app stopped');
    server.close();
  }
}

module.exports = TestServer;
