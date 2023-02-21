function findingremain(amount,digit){
    // digit 2 =>output x.xx000

    remain = "0."
    for(i = 0; i<digit;i++){
        remain = remain +"0"
    }
    amount = amount.toString()
    if(amount.length <= 1){
        return {"remain":0,
                "amount":amount}
    }
    for (i = 0; i <amount.length; i++){
        // console.log(amount.charAt(i))
        if (amount.charAt(i) == '.'){
            
            remain += amount.slice(i+1+digit,amount.length)
            remain = parseFloat(remain)
            amount = amount.slice(0,i+1+digit)
            // console.log(amount)
            return {"remain":remain,
                    "amount":amount}
        }
        else if(i == amount.length -1){
            
            return {"remain":0,
                    "amount":amount}
        }
    }
}
// ans = findingremain(2084.68895030,3)
// console.log(ans)
// console.log(ans.amount)
// console.log(ans.remain)

module.exports = findingremain