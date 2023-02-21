
import websocket
import json
from request import loader
from mysort import sort
def restart():
    buy = []
    test = []
    lastUpdateID = loader("get","nothing")
    previous_u = 0
    def message_reactor(message, buy = buy, previous_u = previous_u):
   
    
        message = json.loads(message)
        print("___________________________________BINANCE___________________________________")
        if message["u"] < lastUpdateID:
            message["b"] = []
            message["a"] = []
        if message["U"] != previous_u + 1 and previous_u != 0:
        
            message["b"] = []
            message["a"] = []
        previous_u = message["u"]
    
    
        for b_i in range(len(message["a"])):
            i = 0
        
            while i <= len(buy):
                message["a"][b_i][1] = float(message["a"][b_i][1])
                if len(buy) <=0:
                    buy.insert(0,message["a"][b_i])
                    if buy[0][1] == 0:
                        buy.pop(0)
                    break
                elif message["a"][b_i][0] == buy[i][0]:
                    buy[i][1] = message["a"][b_i][1]
                    if buy[i][1] == 0:
                        buy.pop(i)
                    break
                i += 1
                if i == len(buy) and message["a"][b_i][0] != buy[i-1]:
                    buy.insert(0,message["a"][b_i])
                    if buy[0][1] == 0:
                        buy.pop(0)
                    break
    


        for b_i in range(len(message["b"])):
            i = 0
            while i <= len(test):
                if len(test) <=0:
                    test.insert(0,message["b"][b_i])
                    break
                elif message["b"][b_i][0] == test[i][0]:
                    test[i][1] = message["b"][b_i][1]
                    break
                i += 1
                if i == len(test) and message["b"][b_i][0] != test[i-1]:
                    test.insert(0,message["b"][b_i])
                    break
    
    

        buy = sort(buy)
        PARAMS = {  "data":buy,
                    "cf": "buy"
                }
        loader("post",PARAMS)
        # print("end:     ",buy)


    def on_pong(ws, *data):
        print('pong received')


    def on_ping(ws, *data):
        #now = datetime.now()
        #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        #print("date and time =", dt_string)
        print('ping received')
    def on_message(ws, message, previous_u = previous_u):
        message_reactor(message)
    def on_error(ws, error):
        print(error)
        restart()

    def on_close(ws, close_status_code, close_msg):
        print("### closed ###")
        restart()

    def on_open(ws):
        print("Opened connection")

    if __name__ == "__main__":
        # websocket.enableTrace(True)
        ws = websocket.WebSocketApp("wss://stream.binance.com:9443/ws/eosbusd@depth@100ms",
                              on_message=on_message,
                                on_error=on_error,
                                on_close=on_close,
                                on_ping=on_ping,
                                on_pong=on_pong,
                                on_open=on_open
                                )

        ws.run_forever(
        #http_proxy_host='127.0.0.1',
        #http_proxy_port=1087,
            ping_interval=10,
            ping_timeout=1
        )
restart()