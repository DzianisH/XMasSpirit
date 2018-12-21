const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const Gpio = require('onoff').Gpio;
const LED1 = new Gpio(17, 'out');
const LED2 = new Gpio(29, 'out');

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
    LED1.writeSync(1);
    LED2.writeSync(1);
    bot.sendMessage(msg.from.id, 'You switched on Xmas three', {replyMarkup});
});

bot.on(['/TurnOffLights'], msg => {
    console.log('User ' + msg.from.username + " sent message " + msg.text);
    LED1.writeSync(0);
    LED2.writeSync(0);
    bot.sendMessage(msg.from.id, 'You switched on Xmas three', {replyMarkup});
});


process.on('SIGINT', () => {
    LED1.writeSync(0);
    LED1.unexport();
    LED2.writeSync(0);
    LED2.unexport();
}); //function to run when user closes using ctrl+c

bot.start();
