import glob, os, math

images = glob.glob('*.png')

for img in images:
    parts = img.split(',')
    first = parts[0]
    second = parts[1].split(',')[0]
    second = second.split('.')[0] + '.' + second.split('.')[1]
    first = float(first)*3600.0
    second = float(second)*3600.0
    first = math.floor(first);
    second = math.floor(second);
    new = str(first) + ',' + str(second) + '.png'
    os.rename(img, new)
    print str(new) + ';',
