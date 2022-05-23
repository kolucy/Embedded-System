const temp = require("node-dht-sensor");
const network = require('network');
const lcd = require('./myLcd.js');
const myFan = require('./myFan.js')
lcd.init();

const humitemp = {
    type : 22,
    pin : 21,
    humi : 0.0,
    temp : 0.0,
    str : '',

    init: (number) => {
        humitemp.pin = number;
        console.log('초기화pin: ' + humitemp.pin)
    },
    read: () => {
        let humistr = '';
        let std = 0;
        temp.read(humitemp.type, humitemp.pin, (err, temp, humi) => {
            if(!err) {
                humitemp.temp = temp.toFixed(1);
                humitemp.humi = humi.toFixed(1);
                humitemp.str = (new Date()).toLocaleString('ko');
                humistr = humitemp.temp + 'C ' + humitemp.humi + '%    ';
                if (std < humitemp.humi) {
                    myFan.turnon();
                    console.log("DC Fan 작동")
                }
                else {
                    myFan.turnoff();
                    console.log("DC Fan 중지")
                }
                network.get_active_interface((err, ifaces) => {
                    if (ifaces !== undefined) {
                        if(ifaces.name == 'wlan0') {
                            console.log('라즈베리파이 IP주소: ' + ifaces.ip_address);
                            lcd.printMessage(ifaces.ip_address, humistr);
                        }
                    }
                });
                console.log('온도/습도 측정값: ' + humistr);
            }
            else
                console.log(err);
        });
        std = humitemp.humi;
    }
}

module.exports.init = function(number) { humitemp.init(number); };
module.exports.read = function() { humitemp.read(); };