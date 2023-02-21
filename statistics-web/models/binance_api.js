const { Spot } = require('@binance/connector')

const apiKey = 'VdV0g4c1IaYSZwjVEjO2Tb7NdlhUtsJ6GbP6JJ7Zz6HYYo2APxSVshzNToS2F9B8'
const apiSecret = 'LPAgZk9xWT5YaaZFeyj2YNU6xcZUebSZtPtr5G3y7LbYUw4Y3dMzBT5d0PDwON16'
const client = new Spot(apiKey, apiSecret, /*{timeout: 5000},*/ {baseURL: 'https://api1.binance.com'})


function BUSDtransfer(amount, side) {
  // side = 'MAIN_FUNDING' / 'FUNDING_MAIN'
  client.userUniversalTransfer(side, 'BUSD', amount)
    .then(response => client.logger.log(response.data))
    .catch(error => client.logger.error(error))
}
function withdraw(amount){
  // amount = float
  client.withdraw(
      'EOS', // coin
      'bybitdeposit', // withdraw address
      amount, // amount
      { // optional parameters
          network: 'EOS',
          addressTag: '500088230',
          walletType: 0
          }
    ).then(response => client.logger.log(response.data))
      .catch(error => client.logger.error(error))
}

// client.account().then(response => client.logger.log(response.data)).catch(error => client.logger.error(error))
function buy(bquantity,symbol){
  // symbol ='EOSBUSD'
  // bprice = bprice.toString()
  client.newOrder(symbol, 'BUY', 'MARKET', {
    quoteOrderQty: bquantity,
    // timeInForce: 'GTC'
  }).then(response => client.logger.log(response.data))
    .catch(error => client.logger.error(error))
}
// binance chỉ nhận float amount đến 0.x
// buy(0.1, 110, "ADABUSD")
// BUSDtransfer(12,"FUNDING_MAIN")
// buy(11,"ADABUSD")
module.exports = {"buy":buy,
                  "withdraw":withdraw,
                  "BUSDtransfer":BUSDtransfer}
