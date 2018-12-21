const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out');

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
    LED.write(1, (err, resp) => {
        if (err) {
            bot.sendMessage(msg.from.id, 'Error while switching on lights', {replyMarkup});
            console.error(err);
            return;
        }
        bot.sendMessage(msg.from.id, 'You switched on Xmas three', {replyMarkup});
    });
});

bot.on(['/TurnOffLights'], msg => {
    console.log('User ' + msg.from.username + " sent message " + msg.text);
    LED.write(0, (err, resp) => {
        if (err) {
            bot.sendMessage(msg.from.id, 'Error while switching off lights', {replyMarkup});
            console.error(err);
            return;
        }
        bot.sendMessage(msg.from.id, 'You switched off Xmas three', {replyMarkup});
    });
});


process.on('SIGINT', () => {
    LED.writeSync(0);
    LED.unexport();
}); //function to run when user closes using ctrl+c

bot.start();
