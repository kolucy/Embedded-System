const gpio = require('pigpio').Gpio;

const TOUCH = 13;
const BUZZER = 20;
const touch = new gpio(TOUCH, {mode:gpio.INPUT});
const buzzer = new gpio(BUZZER, {mode:gpio.OUTPUT});

const TurnOffBuzzer = () => {
    buzzer.digitalWrite(0);
}

const CheckLight = () => {
    buzzer.digitalWrite(0);
    let data = touch.digitalRead();
    console.log(data);
    if(data) {
        console.log("터치!!");
        buzzer.digitalWrite(1);
        setTimeout(TurnOffBuzzer, 100);
    }
}
process.on('SIGINT', function() {
    buzzer.digitalWrite(0);
    console.log("프로그램을 종료합니다");
    process.exit();
});
setInterval(CheckLight, 300);
