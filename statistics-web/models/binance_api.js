const { Spot } = require('@binance/connector')

const apiKey = 'VdV0g4c1IaYSZwjVEjO2Tb7NdlhUtsJ6GbP6JJ7Zz6HYYo2APxSVshzNToS2F9B8'
const apiSecret = 'LPAgZk9xWT5YaaZFeyj2YNU6xcZUebSZtPtr5G3y7LbYUw4Y3dMzBT5d0PDwON16'
const client = new Spot(apiKey, apiSecret, {timeout: 5000})



// client.account().then(response => client.logger.log(response.data)).catch(error => client.logger.error(error))
function buy(bprice,bquantity,symbol){
  // symbol ='EOSBUSD'
  bprice = bprice.toString()
  client.newOrder(symbol, 'BUY', 'LIMIT', {
    price: bprice,
    quantity: bquantity,
    timeInForce: 'GTC'
  }).then(response => client.logger.log(response.data))
    .catch(error => client.logger.error(error))
}
// binance chỉ nhận float amount đến 0.x
// buy(0.4169, 26.3, "ADABUSD")
module.exports = buy
