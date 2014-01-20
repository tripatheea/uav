import glob, os, math
from decimal import *

images = glob.glob('*.png')

for img in images:
    parts = img.split(',')
    first = parts[0]
    second = parts[1].split(',')[0]
    second = second.split('.')[0] + '.' + second.split('.')[1]
    getcontext().prec = 6
    first = float(first);
    second = float(second);

    new = str(first) + ',' + str(second) + '.png'
    #os.rename(img, new)
    print str(new) + ';',
