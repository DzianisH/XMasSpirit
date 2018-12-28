const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const Gpio = require('onoff').Gpio;
const LED1 = new Gpio(17, 'out');
const LED2 = new Gpio(16, 'out');

const replyMarkup = bot.keyboard([['/TurnOn', '/TurnOff', '/Blink'], ['/Status']], {resize: true});

let state = 'off';

bot.on(['/start', '/back', '/help'], msg => {
    console.log('User ' + msg.from.username + " started conversation");
    return bot.sendMessage(msg.from.id, 'You can switch Xmas three here', {replyMarkup});
});


function logMessage(msg) {
    let txt;
    if (msg.from.username) {
        txt = 'User ' + msg.from.first_name + " " + msg.from.last_name + " " + msg.from.username + " sent message " + msg.text;
    } else {
        txt = 'User ' + msg.from.first_name + " " + msg.from.last_name + " sent message " + msg.text;
    }

    console.log(txt);
}

bot.on(['/TurnOn'], msg => {
    logMessage(msg);
    if (state === 'on') {
        bot.sendMessage(msg.from.id, 'LEDs if already turned on', {replyMarkup});
    }
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

bot.on(['/TurnOff'], msg => {
    logMessage(msg);
    if (state === 'off') {
        bot.sendMessage(msg.from.id, 'LEDs if already turned off', {replyMarkup});
    }
    LED1.write(1, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("LED1 turned off");
        LED2.write(1, err => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("LED2 turned off");
            bot.sendMessage(msg.from.id, 'You switched off Xmas tree', {replyMarkup});
        })
    });
});

bot.on(['/Status'], msg => {
    logMessage(msg);
    bot.sendMessage(msg.from.id, 'LEDs are ' + state + ' now', {replyMarkup});
});

bot.on(['/Blink'], msg => {
    logMessage(msg);
    bot.sendMessage(msg.from.id, '@@@LEDs are ' + state + ' now', {replyMarkup});
});

process.on('SIGINT', () => {
    LED1.write(0, () => {
        LED1.unexport();
        LED2.write(0, () => LED2.unexport());
    });
}); //function to run when user closes using ctrl+c

bot.start();
