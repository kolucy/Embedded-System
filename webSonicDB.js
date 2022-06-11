const http = require('http');
const fs = require('fs');
const network = require('network');
const sonic = require('./sensors/sonicdb.js');
const dbif = require('./db/dbif.js');
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
            } } });
    setInterval(dbif.select, 10000); // 10초 간격으로 DB 조회하여 콘솔에 출력
});

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
