/*

Miscellaneous controllers for Replicated, Inc.

*/

module.exports = function(controller) {

    controller.hears(['\\b[prPR]{2}\\b','pull request'], ['direct_message,direct_mention,mention'], function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            convo.addMessage({
                    text: 'I accept pull requests! https://github.com/wlaoh/botkit-starter-slack',
            },'yes_thread');

            convo.addMessage({
                text: 'Ummm... just JIRA it.',
                action: 'stop',
            },'no_thread');

            convo.addMessage({
                text: 'Did I stutter? Say `yes` or `no`',
                action: 'default',
            },'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you know Node.js?', [
                {
                    pattern:  bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern:  bot.utterances.no,
                    callback: function(response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            convo.on('end', function(convo) {

                if (convo.successful()) {
                    bot.reply(message, 'Get cracking!');
                }

            });
        });
    });

    controller.hears(['gnats', 'flies'],['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message,':spider:');
    });

    controller.hears(['deploy'],['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message,'WAIT!');
    });

    controller.hears(['dex'],['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message,':mouse::dash:');
    });

    controller.hears('winston',['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message,':heart_eyes:');
    });

    controller.hears(['hi', 'hello', 'good morning'],['direct_message,direct_mention,mention'], function(bot, message) {

        bot.reply(message, 'Hello! How are you?\nActually don\'t answer, I won\'t respond. :wink:');
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
