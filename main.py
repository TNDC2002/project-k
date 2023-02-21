# importing the requests library
import json
import time

ADA = [0, 0, 0]
USDC = [2000, 0, 0]
binance = 0
bybit = 0
timer = 0
while True:
    buy_path = "C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/inputb.json"
    with open(buy_path, 'r') as j:
        print("binance:",j.read())
        if j.read(2) != '[]':
            j.seek(0)  # it may be redundant but it does not hurt
            binance = json.load(j)
            binance = binance["data"]
        else:
            binance = [0,0]
        


    sell_path = "C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/inputs.json"
    with open(sell_path, 'r') as p:
        print("bybit: ",p.read())
        if p.read(2) != '[]':
            p.seek(0)  # it may be redundant but it does not hurt
            bybit = json.load(p)
            bybit = bybit["data"]
        else:
            bybit = [0,0]


    print("___________________syncer____________________")
    print("binance: ",binance[0])
    print("bybit:   ",bybit[len(bybit)-1]  )

    # comparing
    von = USDC[0]
    bought = 0
    sell = []
    average_buy = 0
    average_sell = 0
    ADA_status = ADA[1]
    sprice = 0
    temp_ADA = [0,0,0]
    temp_USDC = [0,0,0]
    for i in range(3):
        temp_ADA[i] = ADA[i]
        temp_USDC[i] =USDC[i]

    def get_sprice(sADA_amount):
        while sADA_amount >= 0:
            bybit[len(bybit)-1][0] = float(bybit[len(bybit)-1][0])
            bybit[len(bybit)-1][1] = float(bybit[len(bybit)-1][1])
            amount = float(bybit[len(bybit)-1][1])
            price = float(bybit[len(bybit)-1][0])
            price *= (1-0.001)
            res_price = 0
            if amount < sADA_amount:
                res_price += price * (amount/sADA_amount)
                sADA_amount -= amount
                bybit[len(bybit)-1][1] -= amount
            
            elif amount > sADA_amount:               
                res_price += price
                sADA_amount -= sADA_amount
                bybit[len(bybit)-1][1] -= sADA_amount
                break
            else:               
                res_price += price
                sADA_amount -= sADA_amount
                bybit.pop([len(bybit)-1])
                break
        return res_price

    while temp_USDC[0] >= 0:
        amount = float(binance[0][1])
        if amount == 0 :
            binance.pop(0)
            amount = float(binance[0][1])
        price = float(binance[0][0])
        price /= (1-0.001)
        ADA_amount = temp_USDC[0]/price
        if amount < ADA_amount:
            sprice = get_sprice(amount)
            print("sprice: ",sprice,"/",temp_ADA[0])
            if ADA_status == 0 and sprice > von/(amount):
                break
            elif sprice < von/amount:
                break
            temp_USDC[0] -= amount*price
            temp_ADA[0] += amount
            binance.pop(0)

        else:      
            quantity_checker = temp_ADA[0] + temp_USDC[0] / price
            sprice = get_sprice(quantity_checker)
            print("sprice: ",sprice,"/",quantity_checker)
            if sprice < von/(quantity_checker):
                break
            temp_ADA[0] += temp_USDC[0] / price
            temp_USDC[0] -= temp_USDC[0]
            if temp_ADA[1] == 0:
                temp_ADA[1] = temp_ADA[0]/2
                temp_ADA[0] /= 2
                temp_ADA[0] -= 0.8
            break
    # while van can dc update de lay triet de so luong ADA kha thi cho trade
    
    bprice = 0
    
    if ADA_status == 0 and (temp_ADA[0]+temp_ADA[1]) != 0:
        bprice = von/(temp_ADA[0]+temp_ADA[1])
    elif temp_ADA[0] != 0:
        bprice = von/temp_ADA[0]
    else:
        bprice = sprice
    print("bprice: ",bprice)
    fee_ratio = 1/von
    profit_ratio = sprice - bprice
    profit_ratio /= bprice
    if profit_ratio > fee_ratio:
        # thuc thi
        temp_USDC[1] += temp_ADA[1]*sprice
        temp_ADA[1] = 0
        temp_USDC[0] += temp_USDC[1] - 1
        temp_USDC[1] = 0
        temp_ADA[1] += temp_ADA[0] - 0.8
        temp_ADA[0] = 0
        ADA =temp_ADA
        USDC= temp_USDC
    
        dictionary = {
        "ADA":ADA,
        "USDC":USDC
        }
        json_object = json.dumps(dictionary, indent=1)
        with open("C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/result.json", "w") as outfile:
            outfile.write(json_object)
    print("------------------------------------------")
    print("SUMARY:")
    print(ADA)
    print(USDC)
    print("__________________________________________")
    binance = 0
    bybit = 0
    timer += 0.001
    print(timer)
    # time.sleep(0.001)