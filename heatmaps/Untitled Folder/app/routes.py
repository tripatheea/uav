from flask import Flask, render_template
from flask import request
import generate_heatmap
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
        
    data = generate_heatmap.Data(16)
    data.showAndSave(data.getInterpData(), 0, 'interp.png')
    
    return "abc.png"


if __name__ == '__main__':
  app.run(debug=True)
