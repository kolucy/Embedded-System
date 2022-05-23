const myHt = require('./myHt.js')

const HTPIN = 21;
myHt.init(HTPIN);
console.log("=======================================");
console.log("5초후부터 5초간격으로 온습도를 측정합니다");
console.log("=======================================");
setInterval( () => { myHt.read(); }, 5000);