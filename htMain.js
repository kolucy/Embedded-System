const humitemp = require('./humitemp.js');
const HTPIN = 21;

humitemp.init(HTPIN);

console.log("===============================================");
console.log("3초후부터 3초간격으로 온도와 습도를 측정합니다");
console.log("===============================================");

setInterval( ()=>{humitemp.read();}, 3000);