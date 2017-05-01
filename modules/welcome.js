const _ = require('lodash')

module.exports = function(bp) {
  const utterances = {
    good: /good|great|fine|ok|excellent|fantastic/i,
    bad: /bad|sad|not good|not great|bof/i,
    stop: /stop|cancel|abort/i
  }

  const variants = {
    feeling_good: () => _.sample(['Glad to hear that!', 'Fantastic!', 'Yay!']),
    feeling_bad: () => _.sample(['So sorry to hear that', ':('])
  }

  bp.hear({'nlp.action': 'smalltalk.greetings'}, (event, next) => {
    const txt = txt => bp.messenger.createText(event.user.id, txt)

    bp.convo.start(event, convo => {
      convo.threads['default'].addMessage(txt("Hi there, I'm your assistant here to help you improve your heart health"))
      convo.threads['default'].addMessage(txt("Together we'll keep track of your diet, health and well being"))

      convo.threads['default'].addQuestion(txt('How are you?'), [
        {
          pattern: utterances.good,
          callback: () => {
            convo.set('feeling', 'good')
            convo.say(txt(variants.feeling_good()))
            convo.next()
          }
        },
        {
          pattern: utterances.bad,
          callback: () => {
            convo.set('feeling', 'bad')
            convo.say(txt(variants.feeling_bad()))
            convo.say(txt('Anyway..!'))
            convo.next()
          }
        },
        {
          default: true,
          callback: () => {
            // Example of sending a custom message other than text
            const imageMessage = bp.messenger.createAttachment(event.user.id, 'image', 'https://s3.amazonaws.com/botpress-io/images/grey_bg_primary.png')
            convo.say(imageMessage)

            // Order of messages are preserved, i.e. this message will show up after the image has been sent
            convo.say(txt('Sorry I dont understand'))

            // Repeats the last question / message
            convo.repeat()
          }
        }
      ])

      convo.on('done', () => {
        // done
      })

      convo.on('aborted', () => {
        convo.say(txt('You aborted this conversation. Bye!'))
      })
    })
  })
}
