const gpio = require('pigpio').Gpio;
const light = new gpio(14, {mode:gpio.INPUT});
const rled = new gpio(16, {mode: gpio.OUTPUT});
const bled = new gpio(21, {mode: gpio.OUTPUT});
const buzzer = new gpio(19, {mode: gpio.OUTPUT});
const button = new gpio(26, {
    mode:gpio.INPUT,
    pullUpDown: gpio.PUD_UP,
    edge: gpio.FALLING_EDGE
});

var count = 0;

// 채터링문제 해결(Debouncing), 10ms 동안 안정화
button.glitchFilter(10000);

const CheckLight = function(){
    let data = light.digitalRead();
    if(!data){
        buzzer.digitalWrite(1);
    }
    else{
        buzzer.digitalWrite(1);
    }
    setTimeout(CheckLight, 200);
}

const CheckButton = () => {

    let data = button.digitalRead();
    if(!data) {
        switch(count % 2){
        case 0:
            console.log('Pressed ' + count + ', 조도센서 활성화');
            rled.digitalWrite(1);
            bled.digitalWrite(0);
            CheckLight();
            break;
        case 1:
            console.log('Pressed ' + count + ', 조도센서 비활성화');
            rled.digitalWrite(0);
            bled.digitalWrite(1);
            buzzer.digitalWrite(0);
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
    bled.digitalWrite(0);
    buzzer.digitalWrite(0);
    console.log(" 프로그램이 종료됩니다....");
    process.exit();
});

setImmediate(CheckButton);