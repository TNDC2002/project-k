import json
from mysort import sort
def save(data,cfrom):
    if cfrom =="binance":
        file = "C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/buy.json"
    else:
        file = "C:/Users/ASUS/Desktop/code/holy-cup/step 3/socket-io/database/sell.json"
    dictionary = {
    "data": data
    }
    
    json_object = json.dumps(dictionary, indent=1)
    with open(file, "w") as outfile:
        outfile.write(json_object)

    sort(file)
    
