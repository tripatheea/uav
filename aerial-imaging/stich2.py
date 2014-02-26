from __future__ import print_function
from PIL import Image
import os, sys

im = Image.open("1.jpg")

box = (400, 400, 400, 400)
region = im.crop(box)
im.show()
