// import thư viện
var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser')
const fs = require('fs')
var binance_api = require('../models/binance_api')
var bybit_api = require('../models/bybit_api')
var bybit_withdraw = require('../models/bybit_withdraw')
var remain_tracker = require('../models/remain_tracker');
//post setup
var urlencodedParser = bodyparser.urlencoded({ extended: true })


//ejs linker



router.get('/', function (req, res) {
    res.send("fuck off")
})

EOS = [0, 0, 0.0105]
USDC = [2084.6889503, 0, 0]
binance = []
bybit = []
lastest_price = 0
tax = 0
cut_status = 0
EOS_withdrawing_status = 0
BUSD_transing = 0
BUSD_reciever = 0

router.post('/', urlencodedParser, function (req, res) {
    console.time("runtime")
    bdata = []
    sdata = []
    if (req.body.cf == "buy") {

        for (i = 0; i < req.body.data.length; i += 2) {
            bdata.push([parseFloat(req.body.data[i]), parseFloat(req.body.data[i + 1])])
        }
        binance = bdata
    }
    else if (req.body.cf == "sell") {
        for (i = 0; i < req.body.data.length; i += 2) {
            sdata.push([parseFloat(req.body.data[i]), parseFloat(req.body.data[i + 1])])
        }
        bybit = sdata
    }
    else if (req.body.cf == 'bn_signal') {
        if (BUSD_transing > 0) {
            BUSD_reciever += 1
        }
        if (USDC[0] != req.body.BUSD || EOS[0] != req.body.EOS) {
            // err log

            dictionary = {
                "EOS": EOS,
                "USDC": USDC,
                "EOS_sn": req.body.EOS,
                "USDC_sn": req.body.BUSD,
                "tax": tax,
                "lastest_price": lastest_price,
                "cut_status": cut_status,
                "EOS_withdrawing_status": EOS_withdrawing_status,
                "BUSD_transing": BUSD_transing,
                "timestamp": Date.now()
            }
            dictionary = JSON.stringify(dictionary)
            dictionary = dictionary + "\n"
            fs.appendFileSync('../log/bn_signal_err.log', dictionary, err => {
                if (err) {
                    console.log('bn_signal_err.log err: \n', err)
                }
                 
            })

            USDC[0] = parseFloat(req.body.BUSD)
            EOS[0] = parseFloat(req.body.EOS)

            // remainder problem
            remain_ans = remain_tracker(USDC[0], 3)
            if (remain_ans.remain != 0) {
                USDC[2] += remain_ans.remain
                USDC[0] -= remain_ans.remain
                // MAIN_FUNDING
                BUSD_transing += 1
                binance_api.BUSDtransfer(remain_ans.remain, "MAIN_FUNDING")
            }


        } else {

            dictionary = {
                "EOS": EOS,
                "USDC": USDC,
                "EOS_sn": req.body.EOS,
                "USDC_sn": req.body.BUSD,
                "tax": tax,
                "lastest_price": lastest_price,
                "cut_status": cut_status,
                "EOS_withdrawing_status": EOS_withdrawing_status,
                "BUSD_transing": BUSD_transing,
                "timestamp": Date.now()
            }
            dictionary = JSON.stringify(dictionary)
            dictionary = dictionary + "\n"
            fs.appendFileSync('../log/bn_signal_success.log', dictionary, err => {
                if (err) {
                    console.log('bn_signal_success.log err: \n', err)
                }
                 
            })

            // remainder problem
            remain_ans = remain_tracker(USDC[0], 3)
            if (remain_ans.remain != 0) {
                USDC[2] += remain_ans.remain
                USDC[0] -= remain_ans.remain
                // MAIN_FUNDING
                BUSD_transing += 1
                binance_api.BUSDtransfer(remain_ans.remain, "MAIN_FUNDING")
            }
        }

    }
    else if (req.body.cf == 'Bb_signal') {
        if (req.body.EOS > EOS[2]) {
            // deposit signal
            EOS_withdrawing_status = 0
            // logging
            dictionary = {
                "EOS": EOS,
                "EOS_sn": req.body.EOS,
                "tax": tax,
                "lastest_price": lastest_price,
                "cut_status": cut_status,
                "EOS_withdrawing_status": EOS_withdrawing_status,
                "BUSD_transing": BUSD_transing,
                "timestamp": Date.now()
            }
            dictionary = JSON.stringify(dictionary)
            dictionary = dictionary + "\n"
            fs.appendFileSync('../log/deposit.log', dictionary, err => {
                if (err) {
                    console.log('deposit.log err: \n', err)
                }
                 
            })

        }
        else if (req.body.EOS == EOS[2]) {
            //logging
            dictionary = {
                "EOS": EOS,
                "EOS_sn": req.body.EOS,
                "tax": tax,
                "lastest_price": lastest_price,
                "cut_status": cut_status,
                "EOS_withdrawing_status": EOS_withdrawing_status,
                "BUSD_transing": BUSD_transing,
                "timestamp": Date.now()
            }
            dictionary = JSON.stringify(dictionary)
            dictionary = dictionary + "\n"
            fs.appendFileSync('../log/sell.log', dictionary, err => {
                if (err) {
                    console.log('sell.log err: \n', err)
                }
                 
            })
        }
        else {
            // error log
            dictionary = {
                "EOS": EOS,
                "EOS_sn": req.body.EOS,
                "tax": tax,
                "lastest_price": lastest_price,
                "cut_status": cut_status,
                "EOS_withdrawing_status": EOS_withdrawing_status,
                "BUSD_transing": BUSD_transing,
                "timestamp": Date.now()
            }
            dictionary = JSON.stringify(dictionary)
            dictionary = dictionary + "\n"
            fs.appendFileSync('../log/Bb_signal_err.log', dictionary, err => {
                if (err) {
                    console.log('Bb_signal_err.log err: \n', err)
                }
                 
            })
        }

    }


    // compare
    von = USDC[0]
    EOS_status = EOS[1]
    sprice = 0
    temp_EOS = [0, 0, 0]
    temp_USDC = [0, 0, 0]
    while_bybit = bybit
    ballance_index = 0 //dùng để lưu ballance trong vòng lặp 
    // Trưng thu thuế (đã debug)
    if (tax > 0 && USDC[0] > tax) {
        USDC[0] -= tax
        USDC[2] += tax

        // MAIN_FUNDING
        remain_ans = remain_tracker(USDC[0], 3)
        USDC[2] += remain_ans.remain
        USDC[0] -= remain_ans.remain
        BUSD_transing += 1
        binance_api.BUSDtransfer(tax + remain_ans.remain, "MAIN_FUNDING")
        tax = 0
        console.log("tax!!\n")
    }

    // temp_EOS = EOS, temp_USDC = USDC
    for (i = 0; i < 3; i++) {
        temp_EOS[i] = EOS[i]
        temp_USDC[i] = USDC[i]
    }

    function get_sprice(iEOS_amount, temp_bybit, bprice) {
        let sEOS_amount = iEOS_amount
        res_price = 0
        while (sEOS_amount > 0) {
            // đổi str thành float
            temp_bybit[temp_bybit.length - 1][0] = parseFloat(temp_bybit[temp_bybit.length - 1][0])
            temp_bybit[temp_bybit.length - 1][1] = parseFloat(temp_bybit[temp_bybit.length - 1][1])

            amount = temp_bybit[temp_bybit.length - 1][1]
            price = temp_bybit[temp_bybit.length - 1][0]
            // price *= (1 - 0.001)
            if (bprice != "dunbreak" && bprice > price) {
                return "break"
            }
            if (amount <= sEOS_amount) {
                res_price += price * (amount / sEOS_amount)
                sEOS_amount -= amount
                temp_bybit.splice([temp_bybit.length - 1], 1)
            }
            else if (amount > sEOS_amount) {
                res_price += price
                sEOS_amount -= sEOS_amount
                temp_bybit[temp_bybit.length - 1][1] -= sEOS_amount
                break
            }
        }
        if (res_price == 0) {
            return "break"
        }
        return res_price
    }

    // cutlost: (tạm debug)
    // cutlost cần đc update để nếu cả bên buy và bên sale đều giảm mới kích hoạt (tránh gãy giả)
    // đã debug
    if ((parseFloat(bybit[bybit.length - 1][0])/* * (1 - 0.001)*/) <= lastest_price && cut_status != 1 && EOS_withdrawing_status == 0) {
        // cut
        console.log("cut status:", cut_status,"\n")
        cut_price = get_sprice(EOS[1], bybit, "dunbreak")

        // thực thi
        remain_ans = remain_tracker(EOS[1], 2)
        if (remain_ans > 0) {
            EOS[2] += remain_ans.remain
            EOS[1] -= remain_ans.remain
            while (EOS[2] >= 0.01) {
                EOS[1] += 0.01
                EOS[2] -= 0.01
            }
        }

        bybit_api(EOS[1])
        bybit_withdraw(EOS[1] * cut_price)
        EOS_status = 0

        USDC[1] += EOS[1] * cut_price
        EOS[1] = 0
        USDC[0] += USDC[1] - 1
        USDC[1] = 0
        // bù lỗ
        bulo_count = 0
        while (USDC[0] < 2000 && USDC[2] >= 1) {
            // thực thi
            bulo_count += 1

            USDC[2] -= 1
            USDC[0] += 1
        }
        if (bulo_count >= 0) {
            BUSD_transing += 1
            binance_api.BUSDtransfer(bulo_count, "FUNDING_MAIN")
        }

        // console.timeEnd("runtime")
        // res.send("cut")
        cut_status = 1
        lastest_price = 0


    }
    else if (cut_status == 1) {
        cut_status = 0
        console.log("cut reset:", cut_status,"\n")
    }


    // cân nhắc bỏ temp_EOS[0] == 0
    while (temp_USDC[0] > 0 && cut_status == 0 && EOS_withdrawing_status == 0 && temp_EOS[0] == 0 && BUSD_transing == 0) {
        // ghi lại số lượng có thể mua trong vòng lặp
        amount = parseFloat(binance[0][1])

        // xóa binance[0] nếu quantity = 0 
        if (amount == 0) {
            binance.splice(0, 1)
            amount = parseFloat(binance[0][1])
        }

        // tính price
        price = parseFloat(binance[0][0])
        // price /= (1 - 0.001)
        // quy USDC ra EOS
        EOS_amount = temp_USDC[0] / price


        // balancer: khi EOS có dấu hiệu giảm, balancer sẽ ép giảm tỷ lệ chấp nhận rủi ro (tạm debug)
        // balancer cần đc update để nếu cả bên buy và bên sale đều giảm mới kích hoạt (tránh gãy giả)
        if ((temp_EOS[0] + EOS_amount) * 0.98 >= EOS[1] && EOS[1] != 0 && EOS_amount <= amount) {
            // yêu cầu giảm vốn, chuyển phần giảm sang insurance
            if (temp_USDC[0] >= USDC[0] * 0.015) {

                temp_USDC[2] += USDC[0] * 0.015
                temp_USDC[0] -= USDC[0] * 0.015
                ballance_index -= USDC[0] * 0.015
            } else {
                temp_USDC[2] += temp_USDC[0]
                temp_USDC[0] -= temp_USDC[0]
                ballance_index -= temp_USDC[0]
            }
            EOS_amount = temp_USDC[0] / price
            console.log("balancing!!!!\n")
        }

        // tăng vốn
        if (temp_EOS[0] + EOS_amount < EOS[1] * 0.98 && USDC[2] >= USDC[0] * 0.05) {
            temp_USDC[2] -= USDC[0] * 0.01
            temp_USDC[0] += USDC[0] * 0.01
            ballance_index += USDC[0] * 0.01
        }



        if (amount < EOS_amount) {
            // lấy giá sell
            sprice = get_sprice(amount, while_bybit, price)
            if (sprice == "break" || sprice < price) {
                break
            }
            temp_USDC[0] -= parseFloat(binance[0][1]) * price
            temp_EOS[0] += parseFloat(binance[0][1])

            // bỏ phần đã mua
            binance.splice(0, 1)
        }


        else {
            // lấy giá sell
            // EOS_amount có thể = 0
            sprice = get_sprice(EOS_amount, while_bybit, price)

            if (sprice == "break" || sprice < price) {
                if (temp_EOS[1] == 0) {
                    temp_EOS[1] = temp_EOS[0] / 2
                    temp_EOS[0] /= 2
                    temp_EOS[1] -= 0.08
                }
                break
            }

            temp_EOS[0] += EOS_amount
            binance[0][1] = parseFloat(binance[0][1]) - EOS_amount
            temp_USDC[0] -= temp_USDC[0]
            // chuyển 1/2 sang EOS[1] vào start và restart phase
            if (temp_EOS[1] == 0) {
                temp_EOS[1] = temp_EOS[0] / 2
                temp_EOS[0] /= 2
                temp_EOS[1] -= 0.08
            }
            break
        }

    }

    // remainder problem (phải dùng temp vì Withdrawing status)
    remain_ans = remain_tracker(temp_EOS[1], 2)
    if (remain_ans.remain > 0) {
        temp_EOS[2] += remain_ans.remain
        temp_EOS[1] -= remain_ans.remain
        while (temp_EOS[2] >= 0.01) {
            temp_EOS[1] += 0.01
            temp_EOS[2] -= 0.01
        }
    }



    // tính bprice và sprice
    bprice = 0
    sprice = get_sprice(temp_EOS[1], bybit, "dunbreak")

    // đã debug
    if (cut_status == 1 || BUSD_transing != 0 || EOS_withdrawing_status == 1 || temp_USDC[0] == 0 || EOS[0] != 0) {
        // cut_status == 1 (đang cutlost)
        // BUSD_transing != 0 (bn_signal rác từ lệnh BUSDtransfer)
        // EOS_withdrawing_status == 1

        // temp_USDC[0] = 0 (bn_signal rác từ lệnh buy,withdraw)
        // EOS[0] != 0 lệnh buy 1/2
        bprice = sprice // ko cho chạy!!
    }
    else if (EOS_status != 0) {
        bprice = von / temp_EOS[0]//cho phép chạy thường
    }
    else if (EOS_status == 0) {
        //start
        bprice = von / 2
        bprice /= temp_EOS[0]
    }


    // tính profit_ratio và fee_ratio
    temp_USDC1 = temp_EOS[1] * sprice
    fee_ratio = 1 / temp_USDC1
    profit_ratio = sprice - bprice
    profit_ratio /= bprice



    if (profit_ratio != 0 && profit_ratio > fee_ratio) {

        // dùng cho cutlost
        lastest_price = bprice * 0.96

        // thực thi balancer
        if (ballance_index < 0) {
            // giảm vốn
            ballance_index *= -1
            USDC[0] -= ballance_index
            USDC[2] += ballance_index

            remain_ans = remain_tracker(USDC[0], 3)
            USDC[2] += remain_ans.remain
            USDC[0] -= remain_ans.remain
            BUSD_transing += 1
            binance_api.BUSDtransfer(remain_ans.remain + ballance_index, "MAIN_FUNDING")
        } else if (ballance_index > 0) {
            // tăng vốn
            USDC[0] += ballance_index
            USDC[2] -= ballance_index

            remain_ans = remain_tracker(USDC[0], 3)
            USDC[2] += remain_ans.remain
            USDC[0] -= remain_ans.remain
            temp_trans = ballance_index - remain_ans.remain

            if (temp_trans > 0) {
                BUSD_transing += 1
                binance_api.BUSDtransfer(temp_trans, "FUNDING_MAIN")
            } else if (temp_trans < 0) {
                temp_trans *= -1
                BUSD_transing += 1
                binance_api.BUSDtransfer(temp_trans, "MAIN_FUNDING")
            }

        }



        // start tracker
        if (EOS_status == 0) {
            // mua 1/2
            // USDC[0] cần phải đảm bảo đã xử lý remainder
            remain_ans = remain_tracker(USDC[0] / 2, 3)
            if (remain_ans.remain != 0) {
                USDC[2] += remain_ans.remain
                USDC[0] -= remain_ans.remain
                // MAIN_FUNDING
                BUSD_transing += 1
                binance_api.BUSDtransfer(remain_ans.remain, "MAIN_FUNDING")
            }
            binance_api.buy(USDC[0] / 2)
            // rút EOS từ binance sang bybit
            withdrawing = USDC[0] / 2
            withdrawing /= bprice

            binance_api.withdraw(withdrawing)

            EOS_withdrawing_status = 1
        }
        else {
            // mua max
            // USDC[0] đã phải qua remainder
            binance_api.buy(USDC[0])

            // bán max
            // EOS[1] đã phải qua remainder
            bybit_api(temp_EOS[1])

            // rút binance-bybit
            withdrawing = USDC[0] / bprice
            binance_api.withdraw(withdrawing)

            // rút bybit-binance
            // check lại parameter
            bybit_withdraw(EOS[1] * sprice)




            // ghi nợ thuế
            // Thuế: trưng thu và nạp vào insurance khi USDC[0] > von và có lời (tạm debug)
            if (USDC[0] >= 1000 && temp_USDC[0] >= USDC[0]) {
                loi_nhuan = temp_USDC[0] - USDC[0]
                loi_nhuan *= 0.25
                tax = loi_nhuan


            }
        }



        //  thuc thi (sẽ còn cập nhật) (tạm debug)
        temp_USDC[1] += temp_USDC1
        temp_EOS[1] = 0
        temp_USDC[0] += temp_USDC[1] - 1
        temp_USDC[1] = 0
        temp_EOS[1] += temp_EOS[0] - 0.08
        temp_EOS[0] = 0
        // khi submit toàn bộ data tại EOS và USDC sẽ mất!! CẨN THẬN!!!
        EOS = temp_EOS
        // tránh phát sinh giao dịch khi USDC chưa về tới!!!
        USDC[0] = 0


        // out put những lần có lời 
        dictionary = {
            "EOS": EOS,
            // temp_USDC chưa qua remainder nên có thể có sai số tại 0.000x
            "USDC": temp_USDC,
            "tax": tax,
            "lastest_price": lastest_price,
            "cut_status": cut_status,
            "EOS_withdrawing_status": EOS_withdrawing_status,
            "BUSD_transing": BUSD_transing,
            "timestamp": Date.now()
        }
        dictionary = JSON.stringify(dictionary)
        dictionary = dictionary + "\n"
        fs.appendFileSync('../log/success.log', dictionary, err => {
            if (err) {
                console.log('success.log err: \n', err)
            }
             
        })
        console.log("------------------------------------------\n")
        console.log("SUMARY:\n")
        console.log(EOS,"\n")
        console.log("USDC dự kiến: ",temp_USDC,"\n")
        console.log("__________________________________________\n")

    }
    // xóa BUSDtransing
    if (BUSD_reciever > 0) {
        BUSD_transing -= 1
        BUSD_reciever -= 1
    }

    if (EOS_withdrawing_status > 0 || cut_status > 0 || BUSD_transing > 0) {

        dictionary = {
            "cut_status": cut_status,
            "EOS_withdrawing_status": EOS_withdrawing_status,
            "BUSD_transing": BUSD_transing,
            "BUSD_reciever": BUSD_reciever,
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

    console.log("------------------------------------------\n")
    console.log("SUMARY:\n")
    console.log(EOS,"\n")
    console.log(USDC,"\n")
    console.log("__________________________________________\n")



    console.timeEnd("runtime")
    res.send("thank god!! it here")


})

module.exports = router

