module.exports = function(app) {
  require('./file-upload');
  require('./json')(app);
  require('./xml')(app);
  require('./text')(app);
};
