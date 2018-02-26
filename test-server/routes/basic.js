module.exports = function(app) {
  const methodsWithoutBodies = ['GET', 'DELETE', 'OPTIONS'];
  const methodsWithBodies = ['POST', 'PUT'];
  const types = [
    { path: '/text', contentType: 'text/plain', content: 'Hello' },
    { path: '/json', contentType: 'application/json', content: '{"message":"Hello"}' }
  ];

  types.forEach((type) => {
    methodsWithoutBodies.forEach((method) => {
      app[method.toLowerCase()](type.path, (request, response) => {
        response.setHeader('Content-Type', type.contentType);
        response.send(type.content);
      });
    });

    methodsWithBodies.forEach((method) => {
      app[method.toLowerCase()](type.path, (request, response) => {
        response.setHeader('Content-Type', type.contentType);
        response.send(request.body);
      });
    });
  });
};
