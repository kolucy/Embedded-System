const express = require('express');
const fs = require('fs');
const servo = require('./sensors/servo.js');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const network = require('network');
const app = express();
const PORT = 60001;



//const app = express(serverbody);

var mydata = {
    userip: '192.168.137.105',
    degree: '90'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const moveServo = (req, res) => {
    console.log("서보모터(PUT): %s에서 제어명령(%s)을 수신함!", req.body.userip, req.body.degree);
    switch (req.body.degree) {
        case '90': servo.move90(); break;
        case '180': servo.move180(); break;
        case '0': servo.move0(); break;
        default: break;
    }
    res.redirect('/servo');
}

const initServo = (req, res) => {
    console.log("서보모터(POST): %s에서 제어명령(%s)을 수신함!", req.body.userip, req.body.degree);
    servo.move90();
    res.send("서보모터 초기화제어(POST)를 완료하였습니다");
}

const finalServo = (req, res) => {
    console.log("서보모터(DELETE): %s에서 제어명령(%s)을 수신함!", req.body.userip, req.body.degree);
    servo.move90();
    res.send("서보모터 해제제어(DELETE)를 완료하였습니다");
}

const getServo = (req, res) => {
    console.log("GET method 요청받아서, 단순히 응답을 보냅니다");
    fs.readFile('views/controlpage.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset = utf8'});
        res.end(data);
        console.log("웹페이지에 접속하였습니다");
    });
    //res.send("서보모터로부터 답변: 사용법을 숙지하세요!" + "서보모터 초기화(POST), 회전제어(PUT), 설정해제(DELETE)");
}

app.post('/servo', initServo);
app.put('/servo', moveServo);
app.delete('/servo', finalServo);
app.get('/servo', getServo);

app.listen(PORT, () => {
    network.get_active_interface( (err, ifaces) => {
        if (ifaces !== undefined) {
            if (ifaces.name == 'wlan0') {
                console.log("===================================================================");
                console.log('RESt API서버가 가동중입니다 http://' + ifaces.ip_address + ':' + PORT);
                console.log("다른 기기로부터 서보모터 제어명령을 기다립니다");
                console.log("===================================================================");
            }
        }
    });
});

process.on('SIGINT', function() {
    console.log("\nAPI서버를 종료합니다");
    process.exit();
})
