
import websocket
import json
from request import loader

def run():


    def on_message(ws, message):
        print("original msg:",message)
        message = json.loads(message)
        PARAMS = {"BUSD": 0,
                  "EOS":  0,
                  "cf": "bn_signal"
                }
        if message["data"]["e"] == 'outboundAccountPosition':
            print("____________________________")
            i=0
            while i < len(message["data"]['B']):
                print(message["data"]['B'][i]["f"])
                if message["data"]['B'][i]["a"] == 'BUSD':
                    PARAMS["BUSD"] = message["data"]['B'][i]["f"]
                elif message["data"]['B'][i]["a"] == 'EOS':
                    PARAMS["EOS"] = message["data"]['B'][i]["f"]
                print(PARAMS)
                loader("post",PARAMS)
                i+=1

    
    def on_pong(ws, *data):
        print('pong received')


    def on_ping(ws, *data):
        #now = datetime.now()
        #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        #print("date and time =", dt_string)
        print('ping received')
        loader("extend",{"listenKey":listenkey})
        if loader("extend",{"listenKey":listenkey}) == "err":
            run()
    
    def on_error(ws, error):
        print(error)
        run()

    def on_close(ws, close_status_code, close_msg):
        print("### closed ###")
        run()

    def on_open(ws):
        print("Opened connection")

    if __name__ == "__main__":
        # websocket.enableTrace(True)
        listenkey = loader("open_stream",{})
        listenkey = listenkey["listenKey"]
        while listenkey == '':
            listenkey = loader("open_stream",{})
            listenkey = listenkey["listenKey"]
        print("_____________________________________________listen key loaded______________________________________________________")
        URL = "wss://stream.binance.com:9443/stream?streams="
        URL += listenkey
        print(URL)
        ws = websocket.WebSocketApp(URL,
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

run()
