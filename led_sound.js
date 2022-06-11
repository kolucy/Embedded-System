const gpio = require('pigpio').Gpio;

const SOUND = 4;
const RED = 16;
const GREEN = 20;
const BLUE = 21;

const sound = new gpio(SOUND, {mode:gpio.INPUT});
const rled = new gpio(RED, {mode:gpio.OUTPUT});
const gled = new gpio(GREEN, {mode:gpio.OUTPUT});
const bled = new gpio(BLUE, {mode:gpio.OUTPUT});

const CheckLight = function() {
    rled.digitalWrite(0);
    gled.digitalWrite(0);
    bled.digitalWrite(0);

    let data = sound.digitalRead();
    if(data) {
        console.log("소리가 난다!, LED를 켜자");
        bled.digitalWrite(1);
        gled.digitalWrite(1);
   }
    else
	console.log("."); 

}
process.on('SIGINT', function() {
    bled.digitalWrite(0);
    gled.digitalWrite(0);
    console.log("프로그램을 종료합니다");
    process.exit();
});
setInterval(CheckLight, 20);
