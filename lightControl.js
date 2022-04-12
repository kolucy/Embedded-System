const gpio = require('pigpio').Gpio;
const light = new gpio(14, {mode:gpio.INPUT});
const rled = new gpio(16, {mode: gpio.OUTPUT});
const gled = new gpio(20, {mode: gpio.OUTPUT});
const bled = new gpio(21, {mode: gpio.OUTPUT});
const buzzer = new gpio(19, {mode: gpio.OUTPUT});
const button = new gpio(26, {
    mode:gpio.INPUT,
    pullUpDown: gpio.PUD_UP,
    edge: gpio.FALLING_EDGE
});

const CheckLight = function() {
    rled.digitalWrite(0);
    gled.digitalWrite(0);
    bled.digitalWrite(0);
    buzzer.digitalWrite(0);
    let data = light.digitalRead();
    let data2 = button.digitalRead();
    if (!data) {
        console.log("밝다!, LED를 끄자");
        rled.digitalWrite(0);
        gled.digitalWrite(0);
        bled.digitalWrite(0);
    }
    else {
        console.log("어둡다!, LED를 켜자");
        rled.digitalWrite(1);
        gled.digitalWrite(1);
        bled.digitalWrite(1);
        if (!data2) {
            buzzer.digitalWrite(1);
        }
    }
}

process.on('SIGINT', function() {
    rled.digitalWrite(0);
    gled.digitalWrite(0);
    bled.digitalWrite(0);
    buzzer.digitalWrite(0);
    console.log(" 프로그램을 종료합니다");
    process.exit();
});

setInterval(CheckLight, 500);