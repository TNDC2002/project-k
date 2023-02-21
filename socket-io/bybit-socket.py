from logging import lastResort
import websocket
import rel
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
        message = json.loads(message)
        sell = message["data"][0]["b"]

        sell = sort(sell)
        print("\n")
        PARAMS = {  "data":sell,
                    "cf": "sell"
                }
        loader("post",PARAMS)
    

    
    def on_error(ws, error):
        print(error)

    def on_close(ws, close_status_code, close_msg):
        print("### closed ###")
        run()

    def on_open(ws):
        ws.send('{"topic":"mergedDepth","symbol":"301.ADAUSDC","limit":40,"params":{"binary":false,"dumpScale":3},"id":"mergedDepth@sub@301.BTCUSDT","event":"sub"}')
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
                              on_error=on_error)

        ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
        rel.signal(2, rel.abort)  # Keyboard Interrupt
        rel.dispatch()

run()
