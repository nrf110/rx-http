const Express     = require('express'),
      cors        = require('cors'),
      routes      = require('./routes'),
      bodyParser  = require('body-parser'),
      app         = Express();

var server;

class TestServer {
  constructor() {
    app.use(cors());
    app.use(bodyParser.text());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
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
