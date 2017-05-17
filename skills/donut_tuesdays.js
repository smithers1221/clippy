/*

Donut Tuesdays controllers for Replicated, Inc.
Contributed by: https://github.com/divolgin

*/

module.exports = function(controller) {

    controller.hears(['donut', 'doughnut'], 'direct_message,direct_mention,mention', function(bot, message) {

        people = ['dmitriy', 'ethan', 'graysonnull', 'shailie', 'winston', 'dex'];
        tuesday = nearestTuesday();
        name = people[tuesday.weeksSinceWinston % people.length];
        if (tuesday.daysTilDonuts == 0) {
            bot.reply(message, '@' + name + ' is supposed to bring donuts today!');
        } else {
            bot.reply(message, '@' + name + ' is bringing donuts in ' + tuesday.daysTilDonuts + ' day(s).');
        }
    });
};

function nearestTuesday() {
    var moment = require('moment');
    var now = moment("05-23-2017", "MM-DD-YYYY");

    if(now.weekday() <= 2) {
        nextDonutDay = now.clone().isoWeekday("Tuesday");
    } else {
        nextDonutDay = now.clone().add(1, 'week').isoWeekday("Tuesday");
    }

    diffDays = nextDonutDay.date() - now.date();

    return {
        weeksSinceWinston: Math.abs(moment("10-17-2016", "MM-DD-YYYY").diff(nextDonutDay, 'weeks')),
        daysTilDonuts: diffDays,
    }
};
