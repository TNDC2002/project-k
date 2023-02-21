# importing the requests library
import requests
while True:

    PARAMS = {
    "data": [ [ 0.423066, 13259.1 ], [ 0.4323, 83239.3 ] ],
    "cf": "buy"
    }
    r = requests.post(url="http://localhost:8000/reciever/reactor", data = PARAMS)
    PARAMS = {
    "data": [ [ 0.4417, 13259.1 ], [ 0.4312, 83239.3 ] ],
    "cf": "sell"
    }
    r = requests.post(url="http://localhost:8000/reciever/reactor", data = PARAMS)

        