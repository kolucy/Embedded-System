const gpio = require('pigpio').Gpio;

const led = new gpio(19, {mode: gpio.OUTPUT});
const trig = new gpio(6, {mode: gpio.OUTPUT});
const echo = new gpio(13, {mode: gpio.INPUT, alert: true});
const button = new gpio(16, {
    mode: gpio.INPUT,
    pullUpDown: gpio.PUD_UP,
    edge: gpio.FALLING_EDGE
});
const touch = new gpio(26, {mode: gpio.INPUT});
const relay = new gpio(20, {mode: gpio.OUTPUT});

trig.digitalWrite(0); // 초기신호(TRIG <- Low)
button.glitchFilter(10000);

const System = (level) => {
    if (level === 0) {
        console.log("보안시스템 작동");
        trig.digitalWrite(0); // 초기신호(TRIG <- Low)
        Triggering();
        console.log("------------------------------------");
        console.log("근접거리 100cm 이내부터 LED밝기제어...");
        console.log("------------------------------------");
        setInterval( () => {trig.trigger(10, 1);}, 150);
    }
    else{
        console.log("보안시스템 중지");
        clearTimeout(System);
    }
}

const Triggering = () => {
    let startTick, distance, diff;
    echo.on('alert', (level, tick) => {
        if(level ==1) { startTick = tick; }
        else { // level == 0
            const endTick = tick;
            diff = endTick - startTick;
            distance = diff/58; // cm환산법 = diff/58
            if(distance<400) { // 400 이상은 센서오류로 필터처리
                console.log("근접거리: %i cm", distance);
                PWMled(distance);
            }
        }
    });
};

const PWMled = (dis) => { // PWM제어
    if(dis <= 5){
        led.pwmWrite(255); // 5cm 이내: 매우 밝게
        relay.digitalWrite(1);
        CheckTouch();
    }
    else if(dis >= 6 && dis <= 10){
        led.pwmWrite(150); // 5~10cm : 밝게
        relay.digitalWrite(1);
        CheckTouch();
    }
    else if(dis >= 11 && dis <= 20){
        led.pwmWrite(5); // 10~20cm : 어둡게
        relay.digitalWrite(0);
    }
    else {
        led.pwmWrite(0); // 21cm이상 : LED끈다.
        relay.digitalWrite(0);
    }
}

const CheckTouch = () => {
    let data = touch.digitalRead();
    if (data) {
        relay.digitalWrite(0);
        console.log("Touch - RELAY off");
        setTimeout(CheckTouch, 200);
    }
}

button.on('interrupt', System);

process.on('SIGINT', () => {
    led.digitalWrite(0);
    console.log("프로그램을 종료합니다");
    process.exit();
});