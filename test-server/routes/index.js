module.exports = function(app) {
  require('./file-upload')(app);
  require('./basic')(app);
  require('./auth')(app);
  require('./error')(app);
  require('./chunked')(app);
  require('./method-override')(app);
};
