#!/bin/bash
#!/usr/bin/perl

# Uses the acompanying Perl script (create_tiles.pl) to generate map tiles for use with Google Maps.
# 
# Usage ./tiles.sh imagePath
#
# sudo ./create_tiles.pl -v --path tiles/ map.png
# 
# Must be executable first. Use chmod a+x ./tiles.sh if it's not.

chmod +x create_tiles.pl
sudo ./create_tiles.pl -v --path tiles/ $1
sudo chown -R $USER ./tiles
echo Tile Generation Completed
