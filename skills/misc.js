/*

Miscellaneous controllers for Replicated, Inc.

*/

module.exports = function(controller) {

    controller.hears('winston',['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message,':heart_eyes:');
    });

    controller.hears(['hi', 'hello', 'good morning'],['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message, 'Hello! How are you?');
        bot.reply(message, 'Actually don\'t answer, I won\'t respond. :wink:');
    });

    controller.on(['direct_message','direct_mention','mention'], function(bot, message) { 
        if (/[а-яА-ЯЁё]/.test(message.text)) {
            bot.reply(message, 'Здравствуйте Дмитрий')
        } else {
            bot.reply(message, 'Do not test me!')
            bot.api.reactions.add( {
                name: 'rage',
                channel: message.channel,
                timestamp: message.ts
            })
        }
    });
};
