const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const Gpio = require('onoff').Gpio;
const LED1 = new Gpio(17, 'out');
const LED2 = new Gpio(16, 'out');

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
    LED1.write(0, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("LED1 turned on");
        LED2.write(0, err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("LED2 turned on");
            bot.sendMessage(msg.from.id, 'You switched on Xmas tree', {replyMarkup});
        })
    });
});
bot.on(['/TurnOffLights'], msg => {
    console.log('User ' + msg.from.username + " sent message " + msg.text);
    LED1.write(0, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("LED1 turned off");
        LED2.write(0, err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("LED2 turned off");
            bot.sendMessage(msg.from.id, 'You switched off Xmas tree', {replyMarkup});
        })
    });
});

process.on('SIGINT', () => {
    LED1.write(0, () => {
        LED1.unexport();
        LED2.write(0, () => LED2.unexport());
    });
}); //function to run when user closes using ctrl+c

bot.start();
