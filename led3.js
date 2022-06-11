const gpio = require('pigpio').Gpio;

const BLUE = 21;
const RED = 20;
const GREEN = 16;

const rled = new gpio(RED, {mode:gpio.OUTPUT});
const gled = new gpio(GREEN, {mode:gpio.OUTPUT});
const bled = new gpio(BLUE, {mode:gpio.OUTPUT});
var count = 0;

const TimeOutHandler = function() {

    switch ( count % 4){
     case 0: rled.digitalWrite(1);
             gled.digitalWrite(0);
             bled.digitalWrite(0);
             console.log("Node: RED on");
             break;
     case 1: rled.digitalWrite(0);
             gled.digitalWrite(1);
             bled.digitalWrite(0);
             console.log("Node: GREEN on");
             break;
     case 2: rled.digitalWrite(0);
             gled.digitalWrite(0);
             bled.digitalWrite(1);
             console.log("Node: BLUE on");
             break;
     case 3: rled.digitalWrite(0);
             gled.digitalWrite(0);
             bled.digitalWrite(0);
             console.log("Node: All off");
             break;
     default: break;
    }
    count++;
    setTimeout(TimeOutHandler, 1000);
}

setImmediate(TimeOutHandler);
