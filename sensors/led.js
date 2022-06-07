const gpio = require('pigpio').Gpio;
const LEDPIN = 21;
const Led = new gpio(LEDPIN, {mode: gpio.OUTPUT});

const led = {
    turnon: () => {Led.digitalWrite(1); console.log("LED on");},
    turnoff: () => {Led.digitalWrite(0); console.log("LED off");}
}

module.exports.turnon = function() {led.turnon();};
module.exports.turnoff = function() {led.turnoff();};