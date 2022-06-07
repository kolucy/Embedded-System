const request = require('request');
const network = require('network');
var myData = {
    userip: "y.y.y.y",
    degree: "0"
}
const PORT = 60001;

network.get_active_interface( (err, ifaces) => {
    let myUrl;
    if (ifaces !== undefined) {
        if (ifaces.name == 'wlan0') {
            console.log("===================================================================");
            console.log('IP주소:' + ifaces.ip_address + ':' + PORT);
            console.log("REST API 서버로 서보모터 제어명령을 전송합니다");
            console.log("===================================================================");
            myUrl = 'http://' + ifaces.ip_address + ':' + PORT + '/servo';
            myData.userip = ifaces.ip_address;
            myData.degree = '180';
            request.put(
                { url: myUrl,
                form: myData,
                headers: {"content-type": "application/x-www-form-urlencoded"}},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log('REST API 서버로부터 수신한 응답:' + body)
                    }
                }
            );
        }
    }
});