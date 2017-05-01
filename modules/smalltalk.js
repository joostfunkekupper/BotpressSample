module.exports = function(bp) {
  var smalltalk = [
    'smalltalk.agent',
    'smalltalk.appraisal',
    'smalltalk.dialog',
    'smalltalk.person',
    'smalltalk.user',
    'smalltalk.topics'];

  smalltalk.forEach(hear);

  function hear(item, index) {
    bp.hear({'nlp.action': item}, (event, next) => {
      bp.messenger.sendText(event.user.id, event.nlp.fulfillment.speech)
    })
  };
}
