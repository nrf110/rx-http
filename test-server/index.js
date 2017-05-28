const Express = require('express'),
      routes  = require('./routes'),
      app     = Express();

var server;

class TestServer {
  constructor() {
    // routes(app);
    app.use(function(req, res, next) {
      res.send('test');
    });
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
new TestServer().start();
// module.exports = TestServer;
