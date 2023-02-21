# importing the requests library
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


session = requests.Session()
retry = Retry(connect=10000, backoff_factor=0.1)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def loader(method,PARAMS):
    if method == "get":        
        PARAMS = {'symbol': "EOSBUSD",
                'limit': 1000,}
        r = session.get(url="https://api1.binance.com/api/v3/depth",params=PARAMS)
        data = r.json()
        data = data["lastUpdateId"]
        print("lastUpdateId: ",data,"\n")
        return data
    if method == "post":
        
        print("requesting!!")
        # print("params: ",PARAMS)
        r = requests.post(url="http://localhost:8000/reciever/reactor", data = PARAMS)
        return "success"
    if method == "open_stream":
        print("-------------------------loading key-------------------------")
        r = session.post(url="https://api1.binance.com/api/v3/userDataStream", data={},headers={"X-MBX-APIKEY": "VdV0g4c1IaYSZwjVEjO2Tb7NdlhUtsJ6GbP6JJ7Zz6HYYo2APxSVshzNToS2F9B8"})
        data = r.json()
        print(data)
        return data
    if method == "extend":
        print("-------------------------reloading key-------------------------")
        r = session.put(url="https://api1.binance.com/api/v3/userDataStream", data = PARAMS,headers={"X-MBX-APIKEY": "VdV0g4c1IaYSZwjVEjO2Tb7NdlhUtsJ6GbP6JJ7Zz6HYYo2APxSVshzNToS2F9B8"})
        data = r.json()
        if data != {}:
            return "err"
        print("re-new response: ",data)
        return data