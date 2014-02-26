from flask import Flask, render_template
from flask import request
from flask import Response

from generate_heatmap import *
import time
import json
    
app = Flask(__name__)      
 
@app.route('/')
def home():
  #return render_template('home.html')
  return "Nothing interesting here."

@app.route('/generate_heatmap', methods = ['POST', 'GET'])
def generate_heatmap():
    readings = request.args.get('data')
    readings = json.loads(readings)
    filename = generate_heatmap_png(readings)
    return str(filename)


def generate_heatmap_png(readings):
    xs = []
    ys = []
    values = []
    for key in readings:
        x, y = key.split(",")[0], key.split(",")[1]
        xs.append(x)
        ys.append(y)
        values.append(readings[key])
    filename = 'heatmap' + '.png'
    data = Data(16)
    data.showAndSave(data.getInterpData(), 0, './modules/heatmaps/' + str(filename))
    data.updateDataAndSave(xs, ys, values, './modules/heatmaps/' + str(filename))
    return filename

@app.route('/simulate_aerial_image_data')
def simulate_aerial_image_data():
  sampleData = '[1341414,["-2.0,-1.0","1.0,-1.0","1.0,-2.0","2.0,-2.0","2.0,-1.0","-1.0,-1.0"]]'
  sampleData = 'var b = 2;'
  response = Response(response=sampleData, status=200, headers=None, mimetype='text/javascript', content_type=None, direct_passthrough=False)
  return response

if __name__ == '__main__':
  app.run(debug=True)
