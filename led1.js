const gpio = require('pigpio').Gpio;
const LEDPIN = 21;
const led = new gpio(LEDPIN, {mode: gpio.OUTPUT});
var flag = 0;

const TimeOutHandler = function() {
    if (flag > 0) {
        led.digitalWrite(1);
        console.log("Node: LED on");
        flag = 0;
    }
    else{
        led.digitalWrite(0);
        console.log("Node: LED off");
        flag = 1;
    }
    setTimeout (TimeOutHandler, 1000);
}

setTimeout(TimeOutHandler, 1000);
