const mysql = require('mysql');

const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gachon654321',
    database: 'sensordb'
});

const dbif = {
    insert: (data) => {
        let stamptime = new Date();
        client.query('INSERT INTO sonic VALUES (?, ?)', [stamptime, data], (err, result) => {
            if (err) {
                console.log("DB저장실패!"); console.log(err);
            }
            else console.log("DB에 저장을 했습니다!");
        });
    },
    select: () => {
        client.query('SELECT * FROM `sonic`', (error, results, fields) => {
            console.log("--------------현재까지 DB에 저장된 내용을 출력합니다--------------");
            results.forEach((element, i) => {
                let d = element.stamp, str = '';
                str += d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate() + '';
                str += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.';
                str += d.getMilliseconds() + ' ' + element.distance + 'cm';
                console.log(str);
            });
            console.log("--------------------------------");
        });
    },
    delete: () => { /*추후확장*/ },
    update: () => { /*추후확장*/ }
}

module.exports.insert = function(data) { dbif.insert(data); };
module.exports.select = function() { dbif.select(); };
module.exports.delete = function() { dbif.delete(); };
module.exports.update = function() { dbif.update(); };