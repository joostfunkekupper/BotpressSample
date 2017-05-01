module.exports = function(bp) {
  bp.middlewares.load();

  require('./modules/smalltalk')(bp);
  require('./modules/welcome')(bp);
}
