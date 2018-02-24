module.exports = function(app) {
  app.get('/chunked', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Transfer-Encoding', 'chunked');
    response.status(200);

    function sendChunks(remaining) {
      if (remaining > 0) {
        setTimeout(() => {
          response.write(JSON.stringify({ a: remaining }));
          sendChunks(remaining - 1);
        }, 100);
      } else {
        response.end();
      }
    }

    sendChunks(3);
  });
};
