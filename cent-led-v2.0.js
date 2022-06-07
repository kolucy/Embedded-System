const noble = require('@jefflloyd/noble');

const SERVICE_UUID = 'ff01';
const CHARACTERISTIC_UUID = 'ff03';

noble.on('stateChange', function (state) {
    if (state == 'poweredOn') {
        console.log("------------------------------");
        console.log("블루투스: 서비스를 가동합니다...");
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('scanStart', function( ) {
    let myAddress = noble._bindings._hci.address;
    console.log("블루투스: Scanning 을 시작합니다");
    console.log("블루투스: 나의 주소는(%s) ", myAddress);
    console.log("------------------------------------");
});

noble.on('scanStop', function( ) {
// console.log("블루투스: Scanning을 중지합니다");
// console.log("---------------------------------------------- ");
});

noble.on('discover', function (peripheral) {
    console.log("주변 블루투스기기:(%d) (%s)", peripheral.rssi, peripheral.address);
    if (peripheral.advertisement.localName == 'BLE-002' || peripheral.advertisement.localName == 'pi201935208') {
        console.log("------------------------------------");
        console.log("블루투스> 찾았음(discovery) ");
        console.log("블루투스> 이름: " + peripheral.advertisement.localName);
        console.log("블루투스> 주소: " + peripheral.address);
        console.log("블루투스> 신호세기(RSSI): " + peripheral.rssi);
        console.log("------------------------------------");
        console.log("블루투스: 상대편과 연결(connect)합니다");
        peripheral.connect( function (error) {
            var serviceUUIDs = [SERVICE_UUID];
            var characteristicUUIDs = [CHARACTERISTIC_UUID];
            peripheral.discoverSomeServicesAndCharacteristics
            (serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });

    peripheral.once('connect', ( ) => { console.log(" 블루투스: 연결이완료되었습니다.") });
    peripheral.once('disconnect', ( ) => {
        console.log("-------------------------------------------------------");
        console.log("블루투스: 상대방과 연결이 끊어졌습니다.");
        console.log("블루투스: Scanning을 다시합니다.......");
        console.log("-------------------------------------------------------");
        noble.startScanning( );
    });
    } // if 절 끝부분 peripheral.advertisement.localName
});

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    if (error) {
        console.log('블루투스 > 오류발생 discovering services and characteristics ' + error);
        return;
    }

    noble.stopScanning();
    var switchCharacteristic = characteristics[0];

    function receiveData() {
        switchCharacteristic.read( function (error, data) {
            if (!error) {
                console.log('----------------------------------------------------------');
                console.log('블루투스: 데이터 1회성 수신(read): ' + data);
                console.log('----------------------------------------------------------');
                return(data);
            }
        });
    }
    
    function sendData(byte) {
        var buffer = Buffer.from(byte);
        console.log('블루투스: 데이터전송(write): ' + buffer);
        switchCharacteristic.setMaxListeners(0);
        switchCharacteristic.write(buffer, false, function (error) {
            if (error) {
                console.log(error);
                process.exit();
            }
        });
    }
    
    function remote_led_on() {
        sendData("on");
        setTimeout(remote_led_off, 2000);
    }

    function remote_led_off() {
        sendData("off");
        setTimeout(remote_led_on, 2000);
    }

    function NotifyForSubscribe( ) {
        switchCharacteristic.subscribe(function (error) {
            if (!error) {
                console.log('------------------------------------------------------------------');
                console.log('블루투스: 센서데이터 연속서비스 가입(subscribe)');
                console.log('-------------------------------------------------------------------');
            }
        });
        switchCharacteristic.on('data', function (data, isNotification) {
            console.log('블루투스: 센서데이터 연속수신: ' + data);
        });
    }

    function NotifyForUnsubscribe( ) {
        switchCharacteristic.unsubscribe(function (error) {
            if (!error) {
                console.log('----------------------------------------------------------------------');
                console.log('블루투스: 센서데이터 연속서비스 탈퇴(ubsubscribe)');
                console.log('----------------------------------------------------------------------');
            }
        });
    }

    setImmediate(remote_led_on); // 2초마다 LED "on", "off" 송신
    setTimeout(receiveData, 10000); // 10초후 데이터 1회만수신
    setTimeout(NotifyForSubscribe, 20000); // 20초후 연속 수신서비스 가입
    setTimeout(NotifyForUnsubscribe, 30000); // 30초후 연속 수신서비스 탈퇴

} // 이곳까지가 함수 onServicesAndCharacteristicsDiscovered ( ) 의 마지막 부분