const gpio = require('pigpio').Gpio;
const RELAY = 26;
const relay = new gpio(RELAY, {mode:gpio.OUTPUT});
const TurnOn = () => {
	relay.digitalWrite(1);
	console.log("Nodejs: RELAY on");
	setTimeout(TurnOff, 3000);
}
const TurnOff = () => {
	relay.digitalWrite(0);
	console.log("Nodejs: RELAY off");
	setTimeout(TurnOn, 3000);
}
setImmediate(TurnOn);
