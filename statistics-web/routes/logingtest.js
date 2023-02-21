const fs = require('fs');
dictionary = {
    "EOS": 1,
    "USDC": 2,
    "EOS_sn":2,
    "USDC_sn": 1,
    "timestamp": Date.now()
}

dictionary = JSON.stringify(dictionary)
dictionary = dictionary+"\n"
fs.appendFileSync('../log/bn_signal_err.log', dictionary, err => {
    if (err) {
        console.log('success.log err: \n',err) 
    }
    console.log('JSON data is saved.')
})