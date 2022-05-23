const gpio = require('pigpio').Gpio;
const relay = new gpio(26, {mode: gpio.OUTPUT});

const myFan = {
    turnon : () => {
        relay.digitalWrite(1);
    },
    turnoff : () => {
        relay.digitalWrite(0);
    }
};

process.on('SIGINT', function() {
    relay.digitalWrite(0);
    process.exit();
});

module.exports.turnon = function() {myFan.turnon();};
module.exports.turnoff = function() {myFan.turnoff();};