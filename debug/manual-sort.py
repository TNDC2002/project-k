
arr = [['0.43020000', 63690.5], ['0.43000000', 27996.7], ['0.43220000', 57609.9], ['0.43210000', 473.3], ['0.42940000', 59397.2], ['0.42950000', 50048.7], ['0.42980000', 58671.3], ['0.42930000', 21912.4], ['0.42920000', 23919.6], ['0.42900000', 11278.2], ['0.42910000', 16902.5], ['0.42970000', 75927.5], ['0.42960000', 50481.8]]
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

print(sorted_arr)

