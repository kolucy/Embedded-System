const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD(1, 0x27, 16, 2);
const Lcd = {
	message : ['Line1', 'Line2'],
	init: () => {
		console.log('LCD모듈을 초기화합니다');
		lcd.beginSync();
		lcd.clearSync();
	},
	printMessage: (line1, line2) => {
		lcd.setCursorSync(0, 0);
		lcd.printSync(line1);
		lcd.setCursorSync(0, 1);
		lcd.printSync(line2);
	},
	scrollMessage: (line1) => {
		lcd.setCursorSync(0, 0);
		for (const i in line1) {
			lcd.scrollDisplayLeft(line1);
			setTimeout(this.scrollMessage, 150);
		}
	},
    clearMessage: () => {
		lcd.clearSync();
	}
};
module.exports.init = function() {Lcd.init(); };
module.exports.printMessage = function(line1, line2) {Lcd.printMessage(line1, line2); };
module.exports.clearMessage = function() {Lcd.clearMessage(); };
module.exports.scrollMessage = function(line1) {Lcd.scrollMessage(line1); };