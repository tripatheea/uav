import json, ast
from generate_heatmap import *

data = '';
with open('readings.json') as l:
	for line in l:
		data = json.loads(line)

xs = []
ys = []
values = []
for key in data:
    x, y = key.split(",")[0], key.split(",")[1]
    xs.append(x)
    ys.append(y)
    values.append(data[key])


data = Data(16)
data.showAndSave(data.getInterpData(), 0, './modules/isadnterp.png')



#data.generateTSamplesAndSave(10, 2)
#data.updateDataAndSave(xs, ys, values)
