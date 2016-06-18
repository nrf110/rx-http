module.exports = function(app) {
  const methodsWithBodies = ['GET', 'DELETE', 'OPTIONS'];
  const methodsWithoutBodies = ['POST', 'PUT'];

  methodsWithoutBodies.forEach((method) => {
    app[method.toLowerCase()]('/text', (request, response) => {
      response.send('Hello');
    });
  });

  methodsWithBodies.forEach((method) => {
    app[method.toLowerCase()]('/text', (request, response) => {
      response.send(request.body);
    });
  });
};
