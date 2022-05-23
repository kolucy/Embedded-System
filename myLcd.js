const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD(1, 0x27, 16, 2);
const Lcd = {
    message : ['Line1', 'Line2'],
    init : () => {
        console.log('LCD 모듈을 초기화합니다');
        lcd.beginSync();
        lcd.clearSync();
    },
    printMessage : (line1, line2) => {
        lcd.setCursorSync(0, 0);
        lcd.printSync(line1);
        lcd.setCursorSync(0, 1)
        lcd.printSync(line2)
    }
};
module.exports.init = function() {Lcd.init();};
module.exports.printMessage = function(line1, line2) {Lcd.printMessage(line1, line2);};