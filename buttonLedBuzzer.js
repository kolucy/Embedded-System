const gpio = require('pigpio').Gpio;

const rled = new gpio(16, {mode: gpio.OUTPUT});
const gled = new gpio(20, {mode: gpio.OUTPUT});
const bled = new gpio(21, {mode: gpio.OUTPUT});
const button = new gpio(26, {
    mode:gpio.INPUT,
    pullUpDown: gpio.PUD_UP,
    edge: gpio.FALLING_EDGE
});
const buzzer = new gpio(19, {mode: gpio.OUTPUT})

var count = 0;

// 채터링문제 해결(Debouncing), 10ms 동안 안정화
button.glitchFilter(10000);

const CheckButton = () => {

    let data = button.digitalRead();
    if(!data) {
        console.log('Pressed! ' + count);
        switch(count % 3){
        case 0:
            rled.digitalWrite(1);
            gled.digitalWrite(0);
            bled.digitalWrite(0);
            buzzer.digitalWrite(1);
            break;
        case 1:
            rled.digitalWrite(0);
            gled.digitalWrite(0);
            bled.digitalWrite(1);
            buzzer.digitalWrite(1);
            break;
        case 2:
            rled.digitalWrite(0);
            gled.digitalWrite(1);
            bled.digitalWrite(0);
            buzzer.digitalWrite(1);
            break;
        default:
            break;
        }
        count++;
    }
    setTimeout(CheckButton, 200);
}

process.on('SIGINT', function() {
    rled.digitalWrite(0);
    gled.digitalWrite(0);
    bled.digitalWrite(0);
    buzzer.digitalWrite(0);
    console.log(" 프로그램이 종료됩니다....");
    process.exit();
});

setImmediate(CheckButton);