const mcpadc = require('mcp-spi-adc');
const SPI_SPEED = 1000000
const gpio = require('pigpio').Gpio;
const led = new gpio(21, {mode: gpio.OUTPUT});
const VRX = 0
const VRY = 1
const VRZ = 2
const std = 1000;
const PhJ = {
    joyX: 0,
    joyY: 0,
    phZ: 0,
    webio: 0,
    timerId: 0,
    init: (io) => {
        PhJ.joyX = mcpadc.openMcp3208(VRX,
            {speedHz: SPI_SPEED},
            (err) => {
                console.log("SPI 채널0 초기화완료!");
                console.log("--------------------");
                if(err) { console.log('채널0 초기화실패!(HW점검!)'); process.exit(); }
            });
        PhJ.joyY = mcpadc.openMcp3208(VRY,
            {speedHz: SPI_SPEED},
            (err) => {
                console.log("SPI 채널1 초기화완료!");
                console.log("--------------------");
                if(err) { console.log("채널1 초기화실패!(HW점검!)"); process.exit(); }
            });
        PhJ.phZ = mcpadc.openMcp3208(VRZ,
            {speedHz: SPI_SPEED},
            (err) => {
                console.log("SPI 채널2 초기화완료!");
                console.log("--------------------");
                if(err) { console.log("채널2 초기화실패!(HW점검!)"); process.exit(); }
            });
        PhJ.webio = io;
    },
    read: () => {
        let xvalue=-1, yvalue=-1, zvalue=-1;
        PhJ.joyX.read((error, reading) => {
            xvalue = reading.rawValue;
            PhJ.joyY.read((error, reading) => {
                yvalue = reading.rawValue;
                PhJ.phZ.read((error, reading) => {
                    console.log("X좌표: %d  Y좌표: %d, Z좌표: %d", xvalue, yvalue, reading.rawValue);
                    zvalue = reading.rawValue;
                    if(zvalue > std) led.digitalWrite(1);
                    else led.digitalWrite(0);
                    if(xvalue!=-1 && yvalue!=-1 && zvalue!=-1) {
                        PhJ.webio.sockets.emit('watch', xvalue, yvalue, zvalue);
                        xvalue = yvalue = zvalue = -1;
                    }
                });  
            });
        });
    },
    start: (timerValue) => {
        if(PhJ.timerId == 0) {
            PhJ.timerId = setInterval(PhJ.read, timerValue);
        }
        else { console.log("이미 가동중입니다....."); }
    },
    stop: () => {
        if(PhJ.timerId != 0) {
            clearInterval(PhJ.timerId);
            PhJ.timerId = 0;
        }
    },
    terminate: () => {
        PhJ.phZ.close( () => {
            console.log("MCP-ADC를 해제하고, 웹서버를 종료합니다");
            process.exit();
        });
    }
}

module.exports.init = function(io) { PhJ.init(io); };
module.exports.read = function() { PhJ.read(); };
module.exports.start = function(timerValue) { PhJ.start(timerValue); };
module.exports.stop = function() { PhJ.stop(); }
module.exports.terminate = function() {PhJ.terminate(); };