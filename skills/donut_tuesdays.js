/*

Donut Tuesdays controllers for Replicated, Inc.
Contributed by: https://github.com/divolgin

*/

module.exports = function(controller) {

    controller.hears(['^(?!.*add).*donut.*', '^(?!.*add).*doughnut.*'], 'direct_message,direct_mention,mention', function(bot, message) {

        people = ['dex', 'dmitriy', 'ethan', 'graysonnull', 'shailie', 'sloane.e.smith', 'smitha', 'winston'];
	magicNumber = -4;
        tuesday = nearestTuesday();
        name = people[(tuesday.weeksSinceWinston % people.length) + magicNumber];
        if (tuesday.daysTilDonuts == 0) {
            bot.reply(message, '@' + name + ' is supposed to bring donuts today!');
        } else {
            bot.reply(message, '@' + name + ' is bringing donuts in ' + tuesday.daysTilDonuts + ' day(s).');
        }
    });
};

function nearestTuesday() {
    var moment = require('moment');
    var now = moment().utcOffset(-8);

    if(now.weekday() <= 2) {
        nextDonutDay = now.clone().weekday(2);
    } else {
        nextDonutDay = now.clone().add(1, 'week').weekday(2);
    }

    diffDays = now.diff(nextDonutDay, 'days');

    return {
        weeksSinceWinston: Math.abs(moment("10-17-2016", "MM-DD-YYYY").utcOffset(-8).diff(nextDonutDay, 'weeks')),
        daysTilDonuts: Math.abs(diffDays),
    }
};
