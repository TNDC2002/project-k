
const fs = require('fs')
for(i =0;i<10;i++){
    dictionary = {
        "cut_status": 1,
        "EOS_withdrawing_status": 1,
        "BUSD_transing": 1,
        "BUSD_reciever": 1,
        "timestamp": Date.now()
    }
    dictionary = JSON.stringify(dictionary)
    dictionary = dictionary + "\n"
    fs.appendFileSync('../log/stopcode.log', dictionary, err => {
        if (err) {
            console.log('stopcode.log err: \n', err)
        }
         
    })

}