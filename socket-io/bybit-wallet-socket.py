import hmac
import json
import logging
import time

import websocket

from request import loader



def run():
    logging.basicConfig(filename='logfile_wrapper.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s')
    topic = "position"



    def on_message(ws, message):
        data = json.loads(message)
        if type(data) == type([]):
            print("____________________________________________________________________________________________________________________")
            print("original: ")
            print(data)
            print("symbol: ",data[0]["B"][0]["a"])
            print("amount only: ",data[0]["B"][0]["f"])
            if data[0]["B"][0]["a"] == "EOS":
                loader("post",{"EOS": data[0]["B"][0]["f"], "cf": "Bb_signal"})
        



    def on_error(ws, error):
        print('______________________________________________we got error______________________________________________')
        print(error)
        run()


    def on_close(ws):
        print("### about to close please don't close ###")
        run()



    def send_auth(ws):
        key = 'Ljt3FiiQxrHcoLUqIZ'
        secret = 'cgzuin38lwY5gMe0v8vektiVpCWNQUDCQMa1'
        expires = int((time.time() + 10) * 1000)
        _val = f'GET/realtime{expires}'
        # print(_val)
        signature = str(hmac.new(
            bytes(secret, 'utf-8'),
            bytes(_val, 'utf-8'), digestmod='sha256'
        ).hexdigest())
        ws.send(json.dumps({"op": "auth", "args": [key, expires, signature]}))


    def on_pong(ws, *data):
        print('pong received')


    def on_ping(ws, *data):
        #now = datetime.now()
        #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        #print("date and time =", dt_string)
        print('ping received')


    def on_open(ws):
        print('opened')
        send_auth(ws)
        print('send subscription ' + topic)
        ws.send(json.dumps({"op": "subscribe", "args": [topic]}))


    def connWS():
        ws = websocket.WebSocketApp("wss://stream.bybit.com/spot/ws",
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


    if __name__ == "__main__":
        # websocket.enableTrace(True)
        connWS()
run()