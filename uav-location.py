import random
from time import sleep

lowerLat = 42.3470
upperLat = 42.3610

lowerLong = 71.0700
upperLong = 71.1000



while True:
    lat = random.uniform(lowerLat, upperLat)
    lon = 0 - random.uniform(lowerLong, upperLong)

    coordinates = str(lat) + "," + str(lon)

    f = open('uav-location.html', 'wb')
    f.write(coordinates)
    f.close()
    sleep(0.1)
