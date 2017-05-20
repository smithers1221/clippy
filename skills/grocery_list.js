/*

Grocery list controllers for Replicated, Inc.

*/

module.exports = function(controller) {

    // listen for someone saying 'items' to the bot
    // reply with a list of current items loaded from the storage system
    // based on this chanel's id
    controller.hears(['groceries','grocery', 'willy'], 'direct_mention', function(bot, message) {

        // load channel from storage...
        controller.storage.channels.get(message.channel, function(err, channels) {

            // channel object can contain arbitary keys. we will store items in .items
            if (!channels || !channels.items || channels.items.length == 0) {
                bot.reply(message, 'There are no items in our grocery list. Say `add _item_` to add something.');
            } else {
                var text = 'Here are your current items: \n' +
                    generateGroceryList(channels) +
                    'Reply with `bought _number_` to mark an item bought.';

                bot.reply(message, text);

            }

        });

    });

    // listen for a channel saying "add <something>", and then add it to the channel's list
    // store the new list in the storage system
    controller.hears(['add (.*)'],'direct_mention', function(bot, message) {

        var newitem = message.match[1];
        controller.storage.channels.get(message.channel, function(err, channel) {

            if (!channel) {
                channel = {};
                channel.id = message.channel;
                channel.items = [];
            }

            channel.items.push(newitem);

            controller.storage.channels.save(channel, function(err,saved) {

                if (err) {
                    bot.reply(message, 'I experienced an error adding your item: ' + err);
                } else {
                    bot.api.reactions.add({
                        name: 'thumbsup',
                        channel: message.channel,
                        timestamp: message.ts
                    });
                }

            });
        });

    });

    // listen for a channel saying "done <number>" and mark that item as done.
    controller.hears(['bought (.*)'],'direct_mention', function(bot, message) {

        var number = message.match[1];

        if (isNaN(number)) {
            bot.reply(message, 'Please specify a number.');
        } else {

            // adjust for 0-based array index
            number = parseInt(number) - 1;

            controller.storage.channels.get(message.channel, function(err, channel) {

                if (!channel) {
                    channel = {};
                    channel.id = message.channel;
                    channel.items = [];
                }
                if (number < 0 || number >= channel.items.length) {
                    bot.reply(message, 'Sorry, your input is out of range. Right now there are ' + channel.items.length + ' items on your list.');
                } else {
                    console.log(channel.items)

                    var item = channel.items.splice(number,1);

                    controller.storage.channels.save(channel, function(err, saved) {

                        if (err) {
                            bot.reply(message, 'I experienced an error deleting your item: ' + err);
                        } else {
                          // reply with a strikethrough message...
                          bot.reply(message, '~' + item + '~');
                        }
                        if (channel.items.length > 0) {
                            bot.reply(message, 'Here are our remaining items:\n' + generateGroceryList(channel));
                        } else {
                            bot.reply(message, 'Your list is now empty!');
                        }
                    });
                }
            });
        }
    });

    // simple function to generate the text of the task list so that
    // it can be used in various places
    function generateGroceryList(channel) {

        var text = '';

        for (var t = 0; t < channel.items.length; t++) {
            text = text + '> `' +  (t + 1) + '`) ' +  channel.items[t] + '\n';
        }

        return text;

    }
}
