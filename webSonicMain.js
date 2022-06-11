const http = require('http');
const fs = require('fs');
const network = require('network');
const sonic = require('./sensors/sonic.js');
const PORT = 65001;

// 주소 입력하면 나오는 부분(webServer)
const webServer = (request, response) => {
    fs.readFile('views/webpage.html', 'utf8', function(error, data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
        console.log("웹페이지에 접속하였습니다");
    });
}

// http.createServer가 실행할 콜백함수: webServer
const server = http.createServer(webServer)

server.listen(PORT, () => {
    network.get_active_interface( (err, ifaces) => {
        if (ifaces !== undefined) {
            if(ifaces.name == 'wlan0') {
                console.log("=================================================================");
                console.log('웹서버가 대기중입니다 http://' + ifaces.ip_address + ':' + PORT);
                console.log("웹브라우져를 열고, 라즈베리파이 웹주소로 접속하세요")
                console.log("=================================================================");
            }
        }
    });
});

// 웹서버를 소켓서버와 공유하는 개념
// 소켓 인터페이스: 네트워크 프로그래밍에 이용하는 함수
// 웹 기술 발전으로 소켓 인터페이스 대신에 http 프로토콜 사용
// http 이용해서 소켓 인터페이스 사용하자(소켓 프로그래밍) => 웹소켓
// io: 웹소켓 객체

const io = require('socket.io')(server);
sonic.init(io); // 초기화하는데, 웹소켓 사용하겠다

io.on('connection', client => {
    client.on('startmsg', (data) => {
        console.log('가동메시지 수신(측정주기:%d)!', data);
        timeout = data;
        sonic.start(data);
    });
    client.on('stopmsg', (data) => {
        console.log('중지메시지 수신!');
        sonic.stop();
    });
});

process.on('SIGINT', () => {
    console.log("프로그램을 종료합니다");
    process.exit();
});
