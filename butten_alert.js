const gpio = require('pigpio').Gpio;

const button = new gpio(21, {mode:gpio.INPUT, alert: true});
const rled = new gpio(20, {mode:gpio.OUTPUT});
const bled = new gpio(16, {mode:gpio.OUTPUT});
var count = 0;

// 채터링문제 해결(Debouncing)
// 10ms 동안 안정화시킨 후 alert 이벤트 발생
button.glitchFilter(10000);

const CheckButton = (level, tick) => {
    if(level === 0) {
        console.log(++count + ' Button down ' + tick);
            rled.digitalWrite(1);
            bled.digitalWrite(0);   }
    else {
        console.log(++count + ' Button up ' + tick);
            rled.digitalWrite(0);
            bled.digitalWrite(1);   }
}

button.on('alert', CheckButton);

process.on('SIGINT', function() {
    rled.digitalWrite(0);
    bled.digitalWrite(0);
    console.log(" 프로그램이 종료됩니다....");
    process.exit();
});
