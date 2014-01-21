import random
from time import sleep
import ast

'''
lowerLat = 42.3470
upperLat = 42.3610

lowerLong = 71.0700
upperLong = 71.1000
'''
data = ''
with open ("position_log.txt", "r") as myfile:
    data = myfile.read().replace('\n', '')

data = data.split("}{")

size = len(data)
i = 0
for datum in data:
    if i == 0:
        total = datum + "}"
        #datum = ast.literal_eval(datum + "}")
    elif i == ( len(data) - 1):
        total = "{" + datum
    else:
        total = "{" + datum + "}"
    datum = ast.literal_eval(total)
    coordinates = str(datum['t_x']) + ',' + str(datum['t_y'])
    f = open('uav-location.html', 'wb')
    f.write(coordinates)
    f.close()
    sleep(0.1)
    i += 1

    
'''for datum in data:
    print datum
    
    a = datum[1]
    a = a.split('"t_x": ')
    x = a[1].split(',')[0]
    y = a[1].split(',')[1].split(": ")[1]

    print x
    print y
    '''


'''
lowerLat = 0
upperLat = 3.047

lowerLong = 0
upperLong = 2.489


while True:
    lat = random.uniform(lowerLat, upperLat)
    #lon = 0 - random.uniform(lowerLong, upperLong)
    lon = random.uniform(lowerLong, upperLong)
    coordinates = str(lat) + "," + str(lon)

    f = open('uav-location.html', 'wb')
    f.write(coordinates)
    f.close()
    sleep(0.1)
'''
