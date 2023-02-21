var axios = require('axios');
querystring = require('querystring');
const crypto = require('crypto');
const uuid = require('uuid');

function bybit_withdraw(amount){
    var apiKey = "Ljt3FiiQxrHcoLUqIZ";
    var secret = "cgzuin38lwY5gMe0v8vektiVpCWNQUDCQMa1";
    var transferId = uuid.v4();
    var qs="";
    // var amount="11.849285";
    var coin="USDC";
    var timestamp = Date.now();
    amount -= 1
    amount = amount.toString()
    
    var unordered = { "chain": 'SOL',    "amount": amount,    "coin": coin,    "address":"3b3Ertc8Fvz6odzYXsmLVdeX17EueNv8MD8s1NZue5Uv", "timestamp": timestamp,    "api_key": apiKey,    "recv_window": "50000"};
    
    console.log(unordered);
    //sort the unordered object and generate signature value
    var keys = [],k, i, len;
    for (k in unordered) {
      if (unordered.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    keys.sort();
    len = keys.length;
    for (i = 0; i < len; i++) {
      k = keys[i];
      qs=qs + k +'='+unordered[k] + '&'; //Generate QueryString
    }
    sign = crypto.createHmac('sha256', secret).update(qs.slice(0, -1)).digest('hex');
    unordered["sign"] =sign;
    
    var config = {
      method: 'post',
      url: 'https://api.bybit.com/asset/v1/private/withdraw',
      data : unordered
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

// bybit_withdraw(11.849285)
module.exports = bybit_withdraw