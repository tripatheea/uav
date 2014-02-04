import numpy as np
import sys
import matplotlib.pyplot as plt
from scipy.stats import norm
import pylab 
from scipy.interpolate import griddata
from scipy.interpolate import Rbf
from matplotlib import cm
#from sklearn.neighbors import KernelDensity

def convertIndexToXY(lenarray, numElementsPerRow):
    ''' given an array 1,2,3,4 and desired number of columns, 
	this function outputs x y corridnates of the each array member '''
    return  [ (index//numElementsPerRow, index-numElementsPerRow*(index//numElementsPerRow)) for index in xrange(lenarray) ]

class Data():

    def __init__(self, numData, data=[]):
	self.numData = numData
	self.sizeL = np.int(np.sqrt( numData))
	if data:
	    if not instance(data, np.matrix):
		print 'the data needs to be an instance of np matrix'
		sys.exit(2)

	    self.data = data 
	else:
	    self.data = self._generateData( self.numData)
	self.interpolate()

    def _generateData(self, numData):
	# if there is no data given, here we generate data.
	l = np.sqrt(numData)
	if not( np.int(l) == l):
	    print 'Number of Data needs to be squared number of some integer'
	    sys.exit(2)
	l = np.int(l)
	print 'side length is ' + str(l)
	return np.random.rand( l, l) 

    def interpolate(self):
	ti = np.linspace(0,self.sizeL, 100)
	XI, YI = np.meshgrid(ti, ti)
	xy = convertIndexToXY( self.numData, self.sizeL )
	z = self.data #x*np.exp(-x**2-y**2)
	rbf = Rbf( [xx[0] for xx in xy], [yy[1] for yy in xy], z, epsilon=.001)
	ZI = rbf(XI, YI)
	self.interpData = [XI, YI, ZI]

    def showAndSave(self, data, bShow=1, filename=[]):
	#plt.imshow( self.data )
	levels = np.linspace(0, 1, 100)
	# plt.contour( self.data, levels=levels, cmap=plt.cm.Reds )
	plt.pcolor(data[0], data[1], data[2], cmap=cm.jet, vmin=0, vmax=1)
	plt.axis('off')
	if filename:
	    plt.savefig(filename, bbox_inches='tight',pad_inches=-0.5 )
	else:
	    plt.savefig('simpleInterp.png', bbox_inches='tight',pad_inches=-0.5 )
	
	if bShow:
	    plt.show()
    def generateTSamplesAndSave(self, t, intv, spikeSize=8):
	# simulated dynamices of samples after t time elapsed.
	# 1. Each point exponentially decay with rate of alpha
	# 2. Random spikes at every K times 
	# update self.data
	# call self.interpolate()
	# call self.showAndSave( self.getInterpData(), 0, filename)
        timesteps = range( t//intv )
	for t in timesteps:
	    print'simulating ' + str(t) + 'th timestep'
	    self.data= np.exp(-.01*t)*self.data
	    # Simulate random spikes
	    # pick number of spikes (0 to 3), then call randomSpikes.
	    for i in xrange( np.random.randint(0,3) ):
		self.randomSpikes(spikeSize)
	    self.interpolate()
	    self.showAndSave( self.getInterpData(), 0, 'time'+str(t) )

    def randomSpikes(self, spikeSize):
	pickedcellx = np.random.randint(0,self.sizeL)
	pickedcelly = np.random.randint(0,self.sizeL)
	spikedcellValue = spikeSize*self.data[pickedcellx][pickedcelly]
	self.data[pickedcellx][pickedcelly] = spikedcellValue if spikedcellValue < 1 else 1
	
    def updateData(self, newsampleX, newsampleY, newsampleValue):
	self.data[newsampleX][newsampleY] = newsampleValue
	

    def getInterpData(self):
	return self.interpData


if __name__ == "__main__":
    data = Data(16)
    data.showAndSave(data.getInterpData(), 0, 'interp.png')
    data.generateTSamplesAndSave(200, 5)


