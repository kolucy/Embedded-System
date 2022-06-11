const gpio = require('pigpio').Gpio;

const LIGHT = 14;
const LED = 26;
const light = new gpio(LIGHT, {mode:gpio.ALT0});
const led = new gpio(16, {mode:gpio.OUTPUT});

const CheckLight = function() {
    led.digitalWrite(0);
    let data = light.digitalRead();
    if (!data){
        console.log("밝다!, LED를 끄자");
        led.digitalWrite(0);
    }
    else {
        console.log("어둡다!, LED를 켜자");
        led.digitalWrite(1);
    }
}
process.on('SIGINT', function() {
    led.digitalWrite(0);
    console.log("프로그램을 종료합니다");
    process.exit();
});

setInterval(CheckLight, 500);
