// import thư viện
var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser')
const fs = require('fs')
var binance_api = require('../models/binance_api')
var bybit_api = require('../models/bybit_api')

// binance_api(0.4169, 26.38, "ADABUSD")
//post setup
var urlencodedParser = bodyparser.urlencoded({ extended: true })


//ejs linker
router.get('/', function (req, res) {
    res.send("fuck off")
})

ADA = [0, 0, 0]
USDC = [2000, 0, 0]
binance = []
bybit = []
lastest_price = 0
cut_status = 0
router.post('/', urlencodedParser, function (req, res) {
    console.time("runtime")
    // console.log("requested")
    bdata = []
    sdata = []
    if(req.body.cf == "buy"){
        
        for (i =0; i < req.body.data.length; i += 2){
            bdata.push([parseFloat(req.body.data[i]),parseFloat(req.body.data[i+1])])
        }
        binance = bdata
    }
    else if(req.body.cf == "sell"){
        // console.log("params coming")
        for (i =0; i < req.body.data.length; i += 2){
            sdata.push([parseFloat(req.body.data[i]),parseFloat(req.body.data[i+1])])
        }
        bybit = sdata
    }
    
    // compare
    von = USDC[0]
    sell = []
    ADA_status = ADA[1]
    sprice = 0
    temp_ADA = [0,0,0]
    temp_USDC = [0,0,0]
    while_bybit = bybit
    for (i = 0;i < 3;i++){
        temp_ADA[i] = ADA[i]
        temp_USDC[i] =USDC[i]
    }
        
    function get_sprice(iADA_amount, temp_bybit,bprice){
        let sADA_amount = iADA_amount
        res_price = 0
        while (sADA_amount > 0){
            // đổi str thành float
            temp_bybit[temp_bybit.length-1][0] = parseFloat(temp_bybit[temp_bybit.length-1][0])
            temp_bybit[temp_bybit.length-1][1] = parseFloat(temp_bybit[temp_bybit.length-1][1])

            amount = temp_bybit[temp_bybit.length-1][1]
            price = temp_bybit[temp_bybit.length-1][0]
            price *= (1-0.001)
            if (bprice != "dunbreak"&& bprice > price){
                return "break"
            }
            if (amount <= sADA_amount){
                res_price += price * (amount/sADA_amount)
                sADA_amount -= amount
                temp_bybit.splice([temp_bybit.length-1],1)
            }
            else if(amount > sADA_amount){
                res_price += price
                sADA_amount -= sADA_amount
                temp_bybit[temp_bybit.length-1][1] -= sADA_amount
                break
            }
        }
        if(res_price == 0){
            return "break"
        }
        return res_price
    }

    // cutlost: (tạm debug)
    // cutlost cần đc update để nếu cả bên buy và bên sale đều giảm mới kích hoạt (tránh gãy giả)
    if ((parseFloat(bybit[bybit.length-1][0])*(1-0.001)) <= lastest_price && cut_status != 1){
        // cut
        console.log("cut status:", cut_status)
        cut_price = get_sprice(ADA[1],bybit,"dunbreak")
        USDC[1] += ADA[1]*cut_price
        ADA[1] = 0
        USDC[0] += USDC[1] -1
        USDC[1] = 0
        // bù lỗ
        while (USDC[0] < 2000 && USDC[2] >= 1){
            USDC[2] -= 1
            USDC[0] += 1
        }
        // console.timeEnd("runtime")
        // res.send("cut")
        cut_status = 1
        lastest_price = 0
        
    
    }
    else if(cut_status == 1){
        cut_status = 0
        console.log("cut reset:", cut_status)
    }



    while (temp_USDC[0] > 0 && cut_status == 0){
        console.log("cut status:", cut_status)
        // ghi lại số lượng có thể mua trong vòng lặp
        amount = parseFloat(binance[0][1])

        // xóa binance[0] nếu quantity = 0 
        if (amount == 0){
            binance.splice(0, 1)
            amount = parseFloat(binance[0][1])
        } 
            
        // tính price
        price = parseFloat(binance[0][0])
        price /= (1-0.001)
        // quy USDC ra ADA
        ADA_amount = temp_USDC[0]/price


        // balancer: khi ADA có dấu hiệu giảm, balancer sẽ ép giảm tỷ lệ chấp nhận rủi ro (tạm debug)
        // balancer cần đc update để nếu cả bên buy và bên sale đều giảm mới kích hoạt (tránh gãy giả)
        console.log("balancer bug:", (temp_ADA[0] + ADA_amount)*0.98, " >= ", ADA[1] )
        if((temp_ADA[0] + ADA_amount)*0.98 >= ADA[1] && ADA[1] != 0 && ADA_amount <= amount){
            // yêu cầu giảm vốn, chuyển phần giảm sang insurance
            if (temp_USDC[0] >= USDC[0]*0.015){

                temp_USDC[2] += USDC[0]*0.015
                temp_USDC[0] -= USDC[0]*0.015
            }else{
                temp_USDC[2] += temp_USDC[0]
                temp_USDC[0] -= temp_USDC[0]
            }
            ADA_amount = temp_USDC[0]/price
            console.log("balancing!!!!")
        }

        // tăng vốn
        if (temp_ADA[0] + ADA_amount < ADA[1]*0.98 && temp_USDC[2] >= USDC[0]*0.05){
            temp_USDC[2] -= USDC[0]*0.01
            temp_USDC[0] += USDC[0]*0.01
        }



        if (amount < ADA_amount){
            // console.log(ADA_amount," - ",amount)
            // lấy giá sell
            sprice = get_sprice(amount,while_bybit,price)
            // console.log("sprice: ",sprice,"/",amount)
            if (sprice == "break" || sprice < price){
                break
            }
            // console.log("bprice: ",price)
            // console.log("------------------------------------------")
            temp_USDC[0] -= parseFloat(binance[0][1])*price
            temp_ADA[0] += parseFloat(binance[0][1])
            binance.splice(0, 1)
        }
            

        else{
            // lấy giá sell
            // ADA_amount có thể = 0
            sprice = get_sprice(ADA_amount, while_bybit,price)

            if (sprice == "break" ||sprice < price){
                if (temp_ADA[1] == 0){
                    temp_ADA[1] = temp_ADA[0]/2
                    temp_ADA[0] /= 2
                    temp_ADA[1] -= 0.8
                }
                break
            }
                
            temp_ADA[0] += ADA_amount
            binance[0][1] = parseFloat(binance[0][1]) - ADA_amount
            temp_USDC[0] -= temp_USDC[0]
            // chuyển 1/2 sang ADA[1] vào start và restart phase
            if (temp_ADA[1] == 0){
                temp_ADA[1] = temp_ADA[0]/2
                temp_ADA[0] /= 2
                temp_ADA[1] -= 0.8
            }
            break
        }     
            
    }
    
    // tính bprice và sprice (đã debug)
    bprice = 0
    sprice = get_sprice(temp_ADA[1], bybit, "dunbreak")
    // console.log("sprice: ",sprice,"/",temp_ADA[1])
    if (ADA_status == 0 && (temp_ADA[0]+temp_ADA[1]) != 0){
        bprice = von/(temp_ADA[0]+temp_ADA[1])
    }
        
    else if(temp_ADA[0] != 0) {
        bprice = von/temp_ADA[0]
    }
        
    else{
        bprice = sprice
    }
    // console.log("bprice: ",bprice)

    // tính profit_ratio và fee_ratio
    temp_USDC1 = temp_ADA[1]*sprice
    fee_ratio = 1/temp_USDC1
    profit_ratio = sprice - bprice
    profit_ratio /= bprice    

    

    if (profit_ratio > fee_ratio){
        
        // dùng cho cutlost
        lastest_price = bprice * 0.96

        //  thuc thi (sẽ còn cập nhật) (tạm debug)
        temp_USDC[1] += temp_USDC1
        temp_ADA[1] = 0
        temp_USDC[0] += temp_USDC[1] - 1
        temp_USDC[1] = 0
        temp_ADA[1] += temp_ADA[0] - 0.8
        temp_ADA[0] = 0

        // Thuế: trưng thu và nạp vào insurance khi USDC[0] > von và có lời (tạm debug)
        if (USDC[0] >= 1000 && temp_USDC[0] >= USDC[0]){
            loi_nhuan = temp_USDC[0] - USDC[0]
            loi_nhuan *= 0.25
            temp_USDC[0] -= loi_nhuan
            temp_USDC[2] += loi_nhuan 
            console.log("tax!!")
        }



        // khi submit toàn bộ data tại ADA và USDC sẽ mất!! CẨN THẬN!!!
        ADA = temp_ADA
        USDC= temp_USDC
    

        // out put những lần có lời 
        dictionary = {
        "ADA":ADA,
        "USDC":USDC
        }
        dictionary = JSON.stringify(dictionary)
        fs.writeFileSync('../success.json', dictionary, err => {
            if (err) {
              throw err
            }
            console.log('JSON data is saved.')
        })
        // json_object = json.dumps(dictionary, indent=1)
        // with open("C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/result.json", "w") as outfile:
        //     outfile.write(json_object)

    }
    console.log("------------------------------------------")
    console.log("SUMARY:")
    console.log(ADA)
    console.log(USDC)
    console.log("__________________________________________")
    


    
    console.timeEnd("runtime")
    res.send("thank god!! it here")


})

module.exports = router

