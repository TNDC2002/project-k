import time
from translator import trans

def sort(need_to_sort):
    arr = []
    arr.extend(need_to_sort)
    if len(arr) == 1 or len(arr) == 0:
        ts = time.time()
        print("----------------------------------------------------------------------")
        print("date: ",trans(ts))
        print("sorted: ",arr)
        print("----------------------------------------------------------------------")
        return arr       
    
    else:
        sorted_arr = [arr[0]]
        arr.pop(0)
        while len(arr) != 0:
            current = arr[0]
            arr.pop(0)
            sorted_i = len(sorted_arr) - 1
            if current[0] > sorted_arr[sorted_i][0]:
                sorted_arr.append(current)
            else:
                while current[0] < sorted_arr[sorted_i][0] and sorted_i > 0:
                    sorted_arr.insert(sorted_i,current)
                    sorted_i -= 1
                    if current[0] < sorted_arr[sorted_i][0] and sorted_i >= 0:
                        sorted_arr.pop(sorted_i +1)
                if current[0] < sorted_arr[sorted_i][0] and sorted_i == 0:
                    sorted_arr.insert(sorted_i,current)


        ts = time.time()
        print("----------------------------------------------------------------------")
        print("date: ",trans(ts))
        print("sorted: ",sorted_arr)
        print("----------------------------------------------------------------------")
        
        return sorted_arr
