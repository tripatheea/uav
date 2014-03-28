allTiles = Object();

function Rectangle(nw, se, selected, name) {
    this.nw = nw;
    this.se = se;
    this.selected = selected;
    this.action = Array();
    this.name = name;
}


function divide_into_grids(rect, division) {
    
    // width is calculated with longitudes and height with latitudes.
    var width = rect['se'][1] - rect['nw'][1];
    var height = rect['nw'][0] - rect['se'][0];
    
    xDivision = division[0];
    yDivision = division[1];
    xDivision = 4;
    gridWidth = width/xDivision;
    gridHeight = height/yDivision;
    

    pointer = [];
    grids2 = Object();
    for (var i = 0; i < xDivision; i++) {   // Changes longitude.
        pointer[i] = [];
        for (var j = 0; j < yDivision; j++ ) {  // Changes latitude.
            var nw = [];
            var se = [];
            nw[1] = rect['nw'][1] + (i - 1) * gridWidth;
            se[1] = rect['nw'][1] + (i) * gridWidth;
            
            nw[0] = rect['nw'][0] - (j - 1) * gridHeight;
            se[0] = rect['nw'][0] - (j) * gridHeight;
            grids2[j + ',' + i] = new Rectangle(nw, se, false, '');
        }
    }
    console.log(grids2);
    return grids2;
}

function draw_grid(position) {
    
    // Remove the blue boundary of the rectangle drawn.
    // Figure out a better place to put this.
    map.disableKeyDragZoom();
    
    var nw = position[0];
    var se = position[1];
    var bigRectangle = new Rectangle(nw, se, false, '');
    
    console.log(nw, se);

    var max = 10;
    var min = 2;
    var random1 = Math.floor((Math.random() * ((max + 1) - min)) + min);
    var random2 = Math.floor((Math.random() * ((max + 1) - min)) + min);
    xNumber = 4;
    yNumber = 4;
    grids = Object();
    
    grids['width'] = xNumber;
    grids['height'] = yNumber;
    grids['points'] = divide_into_grids(bigRectangle, [xNumber, yNumber]);
    
    var i = 0;
    for (var index in grids['points']) {
        rect = grids['points'][index];
        
        var swBound = new google.maps.LatLng(rect['nw'][1], rect['se'][0]);
        var neBound = new google.maps.LatLng(rect['se'][1], rect['nw'][0]);
        
        var bounds = new google.maps.LatLngBounds(swBound, neBound);
        var selected = false;
        
        var overlayText = "";
        //overlayText = index;
        tile = new tileOverlay(bounds, overlayText, map, index, selected);
        allTiles[index] = tile;
        grids['points'][index]['name'] = overlayText;
        grids['points'][index]['action'] = Array();
        i++;
    }
}



/* 
 * Helper functions for marking the grids.
 * Related to sending the grid data to TERCIO (task planning)
 *
 */


// FOR SOME REASON THE x and y coordinates of the tile index have been flipped. Figure out why and correct that.
// Right now I'm using a quick hack to fix that.

function flash_tile(commaIndex) {
    
    // Use this to trigger a sort of warning about a particular tile.
    
    var hyphenIndex = commaIndex.split(',');
    commaIndex = hyphenIndex[0] + ',' + hyphenIndex[1];
    var hyphenIndex = hyphenIndex[0] + '-' + hyphenIndex[1];
    var selector = "." + hyphenIndex;
    
    grids['points'][commaIndex]['action'] = Array('flash');
    
    setInterval( function(){
                    $(selector).trigger( "click" );
                }, 500);
}

/* Custom overlay code */

var overlay;
tileOverlay.prototype = new google.maps.OverlayView();

/** @constructor */
function tileOverlay(bounds, overlayText, map, index, selected) {
  // Initialize all properties.
  this.bounds_ = bounds;
  this.text_ = overlayText;
  this.index_ = index;
  this.map_ = map;
  this.selected_ = selected;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;


  // Explicitly call setMap on this overlay.
  this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
tileOverlay.prototype.onAdd = function() {
    var div = document.createElement('div');
    //div.style.borderStyle = 'solid';
    //div.style.borderWidth = '2px';
    //div.style.borderColor = 'rgba(0, 0, 0, 1)';
    div.style.position = 'absolute';
    //div.style.background = '#fff';
    div.style.textAlign = 'center';
    div.style.verticalAlign = 'middle';
    div.style.margin = '0';
    div.style.opacity = '0.3';
    div.style.fontSize = '1.5em';
    div.style.fontWeight = '900';
    //div.style.cursor = 'pointer';
    var name = this.index_;
    name = name.split(',');
    div.className = name[0] + '-' + name[1];

    /* 
     * Bind another event like double click or something like that to each tile here.
     * Trigger that from script.js somewhere along the line of the jarvis thingy.
     * Use that trigger (and event) to change the color, like all that stuff about 
     * tiles the user-selected UAV is going to vs the tiles the autonomous UAVS are going to.
     * Like that green and red and stuff like that.
     * 
     * See line ~368 of script.js
     */

    div.innerHTML = this.text_;
    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);

    var index = this.index_;
    var selected = this.selected_;

    //add element to clickable layer 
    this.getPanes().overlayMouseTarget.appendChild(div);

    // set this as locally scoped var so event does not get confused
    var me = this;

    /*
     *   _______           _______  _       _________ _______ 
     *  (  ____ \|\     /|(  ____ \( (    /|\__   __/(  ____ \
     *  | (    \/| )   ( || (    \/|  \  ( |   ) (   | (    \/
     *  | (__    | |   | || (__    |   \ | |   | |   | (_____ 
     *  |  __)   ( (   ) )|  __)   | (\ \) |   | |   (_____  )
     *  | (       \ \_/ / | (      | | \   |   | |         ) |
     *  | (____/\  \   /  | (____/\| )  \  |   | |   /\____) |
     *  (_______/   \_/   (_______/|/    )_)   )_(   \_______)
     *
     */                                                       


    /* 
     * Add a listener to listen for clicks. A click will mark current grid as selected and also change its color.
     * Note that this is different from other events like double click which just flashes the current tile but has no effect
     * whatsoever on the selected property of the underlying Rectangle() object.
     */

            // We'll accept clicks anywhere on this div, but you may want
            // to validate the click i.e. verify it occurred in some portion of your overlay.
            
            google.maps.event.addDomListener(div, 'click', function() {
                
                /* 
                 * Use 'me' to access the parent element. 'this' points to the new event.
                 * The array 'grids' holds Rectangle() objects.
                 * Each Rectangle() has a boolean property called 'selected' which is toggled true/false below.
                 * 
                 */
                
                var action = grids['points'][index]['action'];
                
                
                if ((action.indexOf('select') > -1) || (action.length == 0)) {
                    console.log('Selecting...');
                    if ( ! grids['points'][index]['selected']) {
                        div.style.background = 'rgb(35, 156, 152)';
                        div.style.color = 'rgb(255, 255, 255)';
                        grids['points'][index]['selected'] = true;
                    }
                    else {
                        div.style.background = 'rgb(255, 255, 255)';
                        div.style.color = 'rgb(0, 0, 0)';
                        grids['points'][index]['selected'] = false;
                    }
                }
                
                if (action.indexOf('flash') > -1) {
                        console.log('Flashing...');
                        div.style.background = 'rgb(224, 0, 0)';
                        div.style.color = 'rgb(254, 254, 254)';
                        
                        setTimeout( function(){
                                div.style.background = 'rgb(254, 254, 254)';
                                div.style.color = 'rgb(0, 0, 0)';
                        }, 300);        // This time here must be less than the time in line ~115 i.e. time in the function flash_tile().
                }
                
                if (action.indexOf('autonomous_select') > -1) {
                    div.style.background = 'rgb(0, 224, 0)';
                    div.style.color = 'rgb(254, 254, 254)';
                }
                
                
                action = action[0].split("|");
                if(action.length == 2) {
                    if(action[0] == "color") {
                        div.style.background = action[1];
                        //console.log("Color: " + action[1]);
                        div.style.color = 'rgb(123, 214, 11)';
                        grids['points'][index]['selected'] = true;
                    }
                    else if (action[0] == "relabel") {
                        //div.innerHTML = action[1];
                        div.innerHTML = "";
                        if (action[1] == 'A') { 
                            div.style.background = 'rgb(100, 100, 200)';
                        }
                        else {
                            div.style.background = 'rgb(35, 156, 152)';
                        }
                    }
                }
                
                
                
                
            });
            
     
  
};

tileOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
tileOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};
