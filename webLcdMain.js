const http = require('http');
const fs = require('fs');
const network = require('network');
const socketio = require('socket.io');
const lcd = require('./weblcd.js')
const PORT = 65051;

const serverbody = (request, response) => {
    fs.readFile('views/lcd.html', 'utf8', (err, data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data); //브라우저로 송신
        console.log("웹페이지에 접속하였습니다");
    });
};

const server = http.createServer(serverbody);
const io = require('socket.io')(server);

io.on('connection', client => {
    lcd.init();
    client.on('printmsg', function(data) {
        console.log('출력할 메세지: ', data);
    });
    client.on('printmsg', function(data) {
        console.log('LCD 출력', data);
        if(data.length > 16 && data.length <= 32){
            const data1 = data.substr(0, 16);
            const data2 = data.substr(16, data.length)
            lcd.printMessage(data1, data2);
        }
        else if(data.length > 32) lcd.scrollMessage(data);
        else lcd.printMessage(data, '');
    });
    client.on('clearmsg', function(){
        console.log('LCD 클리어');
        lcd.clearMessage();
    });
});

server.listen(PORT, () => {
    network.get_active_interface((err, ifaces) => {
        if(ifaces !== undefined) {
            if(ifaces.name == 'wlan0') {
                console.log("==============================================================");
                console.log('LCD 메세지 출력 웹서버');
                console.log('웹서버가 대기중입니다 http://' + ifaces.ip_address + ':' + PORT);
                console.log("웹브라우져를 열고, 라즈베리파이 웹주소로 접속하세요");
                console.log("==============================================================");
            }
        }
    });
});