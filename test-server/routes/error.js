let count = 0;

module.exports = function(app) {
  app.get('/error', (request, response) => {
    response.status(400);
    response.send();
  });

  app.get('/retry', (request, response) => {
    count += 1;
    if (count < 2) {
      response.status(400);
      response.send();
    } else {
      response.status(200);
      response.send(count.toString());
    }
  });
};
