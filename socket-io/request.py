# importing the requests library
import requests

def loader(method,PARAMS):
    if method == "get":
        PARAMS = {'symbol': "ADABUSD",
                'limit': 1000,}
        r = requests.get(url="https://api.binance.com/api/v3/depth", params=PARAMS)
        data = r.json()
        data = data["lastUpdateId"]
        print(data)
        return data
    if method == "post":
        # print("params: ",PARAMS)
        r = requests.post(url="http://localhost:8000/reciever/reactor", data = PARAMS)
        return "success"
        