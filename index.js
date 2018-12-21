const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const replyMarkup = bot.keyboard([
    ['/TurnOnLights'],
    ['/TurnOffLights']
], {resize: true});

bot.on(['/start', '/back', '/help'], msg => {
    console.log('User ' + msg.from.username + " started conversation");
    return bot.sendMessage(msg.from.id, 'You can switch Xmas three here', {replyMarkup});
});

bot.on(['/TurnOnLights'], msg => {
    console.log('User ' + msg.from.username + " sent message " + msg.text);
    return bot.sendMessage(msg.from.id, 'You switched on Xmas three', {replyMarkup});
});
bot.on(['/TurnOffLights'], msg => {
    console.log('User ' + msg.from.username + " sent message " + msg.text);
    return bot.sendMessage(msg.from.id, 'You switched off Xmas three', {replyMarkup});
});

bot.start();
