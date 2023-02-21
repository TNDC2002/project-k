const crypto = require('crypto');
const axios = require('axios');

url = 'https://api.bybit.com';

var apiKey = "Ljt3FiiQxrHcoLUqIZ";
var secret = "cgzuin38lwY5gMe0v8vektiVpCWNQUDCQMa1";
var recvWindow = 5000;
var timestamp = Date.now().toString();

function getSignature(parameters, secret) {
  return crypto.createHmac('sha256', secret).update(timestamp + apiKey + recvWindow + parameters).digest('hex');
}

async function http_request(endpoint, method, data, Info) {
  var sign = getSignature(data, secret);
  if (method == "POST") {
    fullendpoint = url + endpoint;
  }
  else {
    fullendpoint = url + endpoint + "?" + data;
    data = "";
  }
  //endpoint=url+endpoint
  var config = {
    method: method,
    url: fullendpoint,
    headers: {
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-SIGN': sign,
      'X-BAPI-API-KEY': apiKey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': '5000',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: data
  };
  console.log(Info + " Calling....");
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

//Create Order
async function sell(squantity) {
  // symbol = "ADAUSDC"
  endpoint = "/spot/v3/private/order"
  const orderLinkId = crypto.randomBytes(16).toString("hex");
  var data = '{"symbol":"' + "EOSUSDC" + '","orderType":"MARKET","side":"Sell","orderLinkId":"' + orderLinkId + '","orderQty":"' + squantity + '","timeInForce":"GTC"}';
  await http_request(endpoint, "POST", data, "Create");
  //Cancel order
  // endpoint="/spot/v3/private/cancel-order"
  // var data = '{"orderLinkId":"' +  orderLinkId +'"}';
  // await http_request(endpoint,"POST",data,"Cancel");
}
// sell(0.1)

// sell(1, 0.00001, "EOSUSDC")
module.exports = sell