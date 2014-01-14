import glob, os

images = glob.glob('*.png')

for img in images:
    #os.rename(old, new)  
    parts = img.split(',')
    first = parts[0]
    second = parts[1].split(',')[0]
    second = second.split('.')[0] + '.' + second.split('.')[1]
    print second
