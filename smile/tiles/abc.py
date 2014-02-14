import glob, os

images = glob.glob('*.png')

for img in images:
    print img + ';',
