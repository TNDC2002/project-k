import websocket
import json
from mysort import sort
from request import loader
import time

def run():

    sell = []
    last_call = time.time()
    last_call *= 1000
    last_call = int(last_call)
    input_last_call = [last_call]
    print(last_call)
    def on_message(ws, message, last_call = input_last_call):
        print("___________________________________BYBIT___________________________________")
        message = json.loads(message)
        sell = message["data"][0]["b"]

        sell = sort(sell)
        print("\n")
        PARAMS = {  "data":sell,
                    "cf": "sell"
                }
        loader("post",PARAMS)
    
    def on_pong(ws, *data):
        print('pong received')


    def on_ping(ws, *data):
        #now = datetime.now()
        #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        #print("date and time =", dt_string)
        print('ping received')
    
    def on_error(ws, error):
        print(error)
        run()

    def on_close(ws, close_status_code, close_msg):
        
        print("### closed ###")
        run()

    def on_open(ws):
        ws.send('{"topic":"mergedDepth","symbol":"301.EOSUSDC","limit":40,"params":{"binary":false,"dumpScale":4},"id":"mergedDepth@sub@301.BTCUSDT","event":"sub"}')
        print("Opened connection")

    if __name__ == "__main__":
        # websocket.enableTrace(True)
        URL = "wss://ws2.byapis.com/spot/ws/quote/v1?timestamp="
        URLstamp = str(last_call)
        URLstamp += "c"
        URL += URLstamp
        print(URL)
        ws = websocket.WebSocketApp(URL,
                              on_open=on_open,
                              on_message=on_message,
                              on_close=on_close,
                              on_error=on_error,
                              on_ping=on_ping,
                              on_pong=on_pong,
                              keep_running=True)

        ws.run_forever(
        #http_proxy_host='127.0.0.1',
        #http_proxy_port=1087,
            ping_interval=10,
            ping_timeout=1
        )

run()
