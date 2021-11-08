// Require the core node modules.
var CryptoJS = require("crypto-js");
var net = require('net');

var md5 = require('md5');
var sha256 = require('sha256');
var keyText = '123456'
const { v4: uuidv4 } = require('uuid');

let dt1 = {
      "buyerInfo": "01313919506",
      "currency_code": "BDT",
      "goodsInfo": [
        {
        "code": "11",
        "hsCode": "",
        "item": "milk",
        "price": "100",
        "qty": "1",
        "sd_category": "13801",
        "vat_category": "13501"
       }
      ],
      "payType": "PAYTYPE_CASH",
      "taskID": uuidv4()
}

let chCOde = sha256(JSON.stringify(dt1))

let sellData = {
  cashierID: "11",
  checkCode: chCOde,
  data: dt1,
  type: "SDCA0000"
}


var data = sellData

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), sha256(md5(keyText))).toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, sha256(md5(keyText)));
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData); // [{id: 1}, {id: 2}]

var client = new net.Socket();

client.connect(6660, '172.172.16.21', function() {
	console.log('Connected');
	client.write(ciphertext);
});

client.on('data', function(data) {
    console.log(data)
        /*var bytes  = CryptoJS.AES.decrypt(base64decode(data), sha256(md5(keyText)));
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        console.log(bytes.toString(CryptoJS.enc.Utf8)); */  
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});