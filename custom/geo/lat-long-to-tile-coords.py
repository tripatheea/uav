import json
from pprint import pprint
import glob, os


json_data = open('./tiles.json')
data = json.load(json_data)

images = glob.glob('*.png')
print data
for img in images:
    print img
    






