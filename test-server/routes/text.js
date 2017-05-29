module.exports = function(app) {
  const methodsWithoutBodies = ['GET', 'DELETE', 'OPTIONS'];
  const methodsWithBodies = ['POST', 'PUT'];

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
