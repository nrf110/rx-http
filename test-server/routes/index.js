module.exports = function(app) {
  require('./file-upload')(app);
  require('./json')(app);
  require('./xml')(app);
  require('./text')(app);
  require('./auth')(app);
  require('./error')(app);
  require('./chunked')(app);
};
