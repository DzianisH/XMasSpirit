const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '742600804:AAHVflkpctW6p1fRS6RVuLxlFqWY6IB9kuM'
});

const Gpio = require('onoff').Gpio;
const LED1 = new Gpio(17, 'out');
const LED2 = new Gpio(16, 'out');

const replyMarkup = bot.keyboard([['/TurnOn', '/TurnOff', '/Blink'], ['/Status']], {resize: true});

let state = 'off';

bot.on(msg => {
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
        bot.sendMessage(msg.from.id, 'LEDs are already turned on', {replyMarkup});
        return;
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
            state = 'on';
            bot.sendMessage(msg.from.id, 'You switched on Xmas tree', {replyMarkup});
        })
    });
});

bot.on(['/TurnOff'], msg => {
    logMessage(msg);
    if (state === 'off') {
        bot.sendMessage(msg.from.id, 'LEDs are already turned off', {replyMarkup});
        return;
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
            state = 'off';
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
    if (state === 'blink') {
        bot.sendMessage(msg.from.id, 'LEDs are already blinking', {replyMarkup});
        return;
    }

    let state1 = state;
    let state2 = state;

    const ledBlink1 = setInterval(() => {
        if (state !== 'blink') {
            clearTimeout(ledBlink1);
            return;
        }
        if (state1 === 'on') {
            LED1.write(1, () => state1 = 'off');
        } else {
            LED1.write(0, () => state1 = 'on');
        }
    }, 1000);
    const ledBlink2 = setInterval(() => {
        if (state !== 'blink') {
            clearTimeout(ledBlink1);
            return;
        }
        if (state2 === 'on') {
            LED2.write(1, () => state2 = 'off');
        } else {
            LED2.write(0, () => state2 = 'on');
        }
    }, 618);
    state = 'blink';
    bot.sendMessage(msg.from.id, 'You blink Xmas tree', {replyMarkup});
});

process.on('SIGINT', () => {
    LED1.write(0, () => {
        LED1.unexport();
        LED2.write(0, () => LED2.unexport());
    });
}); //function to run when user closes using ctrl+c

bot.start();
