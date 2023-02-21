# importing the requests library
import requests
def loader(symbol):
    
    PARAMS = {'symbol': symbol,
                'limit': 1000,}
    r = requests.get(url="https://api.binance.com/api/v3/depth", params=PARAMS)
    data = r.json()
    data = data["lastUpdateId"]
    print(data)
    return data