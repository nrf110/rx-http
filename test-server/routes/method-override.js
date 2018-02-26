module.exports = function(app) {
  app.patch('/patch', (request, response) => {
    response.send(request.body);
  });
};
