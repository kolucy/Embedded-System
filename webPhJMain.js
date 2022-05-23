const http = require('http');
const fs = require('fs');
const network = require('network');
const socketio = require('socket.io');
const mcpadc = require('mcp-spi-adc');
const phj = require('./sensors/phj.js')
const PORT = 65090;

const serverbody = (request, response) => {
    fs.readFile('views/phchart.html', 'utf8', (err, data) => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data); //브라우저로 송신
        console.log("웹페이지에 접속하였습니다");
    });
};

const server = http.createServer(serverbody);
const io = require('socket.io')(server);

phj.init(io);

io.on('connection', client => {
    client.on('phstd', function(data) {
        console.log('조도센서 기준값: ', data);
        phj.std = data;
    });
    client.on('startmsg', function(data) {
        console.log('조이스틱, 조도센서 가동메시지 수신(측정주기:%d)!', data);
        timeout = data;
        phj.start(data);
    });
    client.on('stopmsg', function(data){
        console.log('조이스틱, 조도센서 중지메시지 수신!');
        phj.stop();
    });
});

server.listen(PORT, () => {
    network.get_active_interface((err, ifaces) => {
        if(ifaces !== undefined) {
            if(ifaces.name == 'wlan0') {
                console.log("==============================================================");
                console.log('조이스틱, 조도센서용 웹서버');
                console.log('웹서버가 대기중입니다 http://' + ifaces.ip_address + ':' + PORT);
                console.log("웹브라우져를 열고, 라즈베리파이 웹주소로 접속하세요");
                console.log("==============================================================");
            }
        }
    });
});

process.on('SIGINT', () => {
    phj.terminate(); //MCP칩을 해제하고 프로그램을 종료
});