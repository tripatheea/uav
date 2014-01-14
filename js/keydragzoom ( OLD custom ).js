(function () {
    var u = function (a) {
        var b;
        switch (a) {
        case "thin":
            b = "2px";
            break;
        case "medium":
            b = "4px";
            break;
        case "thick":
            b = "6px";
            break;
        default:
            b = a
        }
        return b
    };
    var t = function (h) {
        var b;
        var a = {};
        if (document.defaultView && document.defaultView.getComputedStyle) {
            b = h.ownerDocument.defaultView.getComputedStyle(h, "");
            if (b) {
                a.top = parseInt(b.borderTopWidth, 10) || 0;
                a.bottom = parseInt(b.borderBottomWidth, 10) || 0;
                a.left = parseInt(b.borderLeftWidth, 10) || 0;
                a.right = parseInt(b.borderRightWidth, 10) || 0;
                return a
            }
        } else if (document.documentElement.currentStyle) {
            if (h.currentStyle) {
                a.top = parseInt(u(h.currentStyle.borderTopWidth), 10) || 0;
                a.bottom = parseInt(u(h.currentStyle.borderBottomWidth), 10) || 0;
                a.left = parseInt(u(h.currentStyle.borderLeftWidth), 10) || 0;
                a.right = parseInt(u(h.currentStyle.borderRightWidth), 10) || 0;
                return a
            }
        }
        a.top = parseInt(h.style["border-top-width"], 10) || 0;
        a.bottom = parseInt(h.style["border-bottom-width"], 10) || 0;
        a.left = parseInt(h.style["border-left-width"], 10) || 0;
        a.right = parseInt(h.style["border-right-width"], 10) || 0;
        return a
    };
    var v = {
        x: 0,
        y: 0
    };
    var s = function (e) {
        v.x = (typeof document.documentElement.scrollLeft !== "undefined" ? document.documentElement.scrollLeft : document.body.scrollLeft);
        v.y = (typeof document.documentElement.scrollTop !== "undefined" ? document.documentElement.scrollTop : document.body.scrollTop)
    };
    s();
    var q = function (e) {
        var a = 0,
            posY = 0;
        e = e || window.event;
        if (typeof e.pageX !== "undefined") {
            a = e.pageX;
            posY = e.pageY
        } else if (typeof e.clientX !== "undefined") {
            a = e.clientX + v.x;
            posY = e.clientY + v.y
        }
        return {
            left: a,
            top: posY
        }
    };
    var n = function (h) {
        var e = h.offsetLeft;
        var g = h.offsetTop;
        var b = h.offsetParent;
        while (b !== null) {
            if (b !== document.body && b !== document.documentElement) {
                e -= b.scrollLeft;
                g -= b.scrollTop
            }
            var m = b;
            var f = m.offsetLeft;
            var a = m.offsetTop;
            if (!f && !a && window.getComputedStyle) {
                var d = document.defaultView.getComputedStyle(m, null).MozTransform || document.defaultView.getComputedStyle(m, null).WebkitTransform;
                if (d) {
                    if (typeof d === "string") {
                        var c = d.split(",");
                        f += parseInt(c[4], 10) || 0;
                        a += parseInt(c[5], 10) || 0
                    }
                }
            }
            e += f;
            g += a;
            b = b.offsetParent
        }
        return {
            left: e,
            top: g
        }
    };
    var o = function (a, b) {
        if (a && b) {
            for (var x in b) {
                if (b.hasOwnProperty(x)) {
                    a[x] = b[x]
                }
            }
        }
        return a
    };
    var r = function (h, a) {
        if (typeof a !== "undefined") {
            h.style.opacity = a
        }
        if (typeof h.style.opacity !== "undefined") {
            h.style.filter = "alpha(opacity=" + (h.style.opacity * 100) + ")"
        }
    };
	
	/*
    function DragZoom(a, d) {
        var b = this;
        var c = new google.maps.OverlayView();
        c.onAdd = function () {
            b.init_(a, d)
        };
        c.draw = function () {};
        c.onRemove = function () {};
        c.setMap(a);
        this.prjov_ = c
    }
    */    
    
    var prj = null;
    function DragZoom(map, opt_zoomOpts) {
        var ov = new google.maps.OverlayView();

        var me = this;
        ov.onAdd = function () {
            me.init_(map, opt_zoomOpts);
        };
        ov.draw = function () {
        };
        ov.onRemove = function () {
        };
        ov.setMap(map);
        this.prjov_ = ov;
        google.maps.event.addListener(map, 'idle', function () {
            prj = ov.getProjection();
        });
    }
    
    
    
    DragZoom.prototype.init_ = function (a, c) {
        var i;
        var b = this;
        this.map_ = a;
        c = c || {};
        this.key_ = c.key || "shift";
        this.key_ = this.key_.toLowerCase();
        this.borderWidths_ = t(this.map_.getDiv());
        this.veilDiv_ = [];
        for (i = 0; i < 4; i++) {
            this.veilDiv_[i] = document.createElement("div");
            this.veilDiv_[i].onselectstart = function () {
                return false
            };
            o(this.veilDiv_[i].style, {
                backgroundColor: "gray",
                opacity: 0.25,
                cursor: "crosshair"
            });
            o(this.veilDiv_[i].style, c.paneStyle);
            o(this.veilDiv_[i].style, c.veilStyle);
            o(this.veilDiv_[i].style, {
                position: "absolute",
                overflow: "hidden",
                display: "none"
            });
            if (this.key_ === "shift") {
                this.veilDiv_[i].style.MozUserSelect = "none"
            }
            r(this.veilDiv_[i]);
            if (this.veilDiv_[i].style.backgroundColor === "transparent") {
                this.veilDiv_[i].style.backgroundColor = "white";
                r(this.veilDiv_[i], 0)
            }
            this.map_.getDiv().appendChild(this.veilDiv_[i])
        }
        this.visualEnabled_ = c.visualEnabled || false;
        this.visualPosition_ = c.visualPosition || google.maps.ControlPosition.LEFT;
        this.visualPositionOffset_ = c.visualPositionOffset || new google.maps.Size(35, 0);
        this.visualPositionIndex_ = c.visualPositionIndex || null;
        this.visualSprite_ = c.visualSprite || "http://maps.gstatic.com/mapfiles/ftr/controls/dragzoom_btn.png";
        this.visualSize_ = c.visualSize || new google.maps.Size(20, 20);
        this.visualTips_ = c.visualTips || {};
        this.visualTips_.off = this.visualTips_.off || "Turn on drag zoom mode";
        this.visualTips_.on = this.visualTips_.on || "Turn off drag zoom mode";
        this.boxDiv_ = document.createElement("div");
        o(this.boxDiv_.style, {
            border: "4px solid #736AFF"
        });
        o(this.boxDiv_.style, c.boxStyle);
        o(this.boxDiv_.style, {
            position: "absolute",
            display: "none"
        });
        r(this.boxDiv_);
        this.map_.getDiv().appendChild(this.boxDiv_);
        this.boxBorderWidths_ = t(this.boxDiv_);
        this.listeners_ = [google.maps.event.addDomListener(document, "keydown", function (e) {
            b.onKeyDown_(e)
        }), google.maps.event.addDomListener(document, "keyup", function (e) {
            b.onKeyUp_(e)
        }), google.maps.event.addDomListener(this.veilDiv_[0], "mousedown", function (e) {
            b.onMouseDown_(e)
        }), google.maps.event.addDomListener(this.veilDiv_[1], "mousedown", function (e) {
            b.onMouseDown_(e)
        }), google.maps.event.addDomListener(this.veilDiv_[2], "mousedown", function (e) {
            b.onMouseDown_(e)
        }), google.maps.event.addDomListener(this.veilDiv_[3], "mousedown", function (e) {
            b.onMouseDown_(e)
        }), google.maps.event.addDomListener(document, "mousedown", function (e) {
            b.onMouseDownDocument_(e)
        }), google.maps.event.addDomListener(document, "mousemove", function (e) {
            b.onMouseMove_(e)
        }), google.maps.event.addDomListener(document, "mouseup", function (e) {
            b.onMouseUp_(e)
        }), google.maps.event.addDomListener(window, "scroll", s)];
        this.hotKeyDown_ = false;
        this.mouseDown_ = false;
        this.dragging_ = false;
        this.startPt_ = null;
        this.endPt_ = null;
        this.mapWidth_ = null;
        this.mapHeight_ = null;
        this.mousePosn_ = null;
        this.mapPosn_ = null;
        if (this.visualEnabled_) {
            this.buttonDiv_ = this.initControl_(this.visualPositionOffset_);
            if (this.visualPositionIndex_ !== null) {
                this.buttonDiv_.index = this.visualPositionIndex_
            }
            this.map_.controls[this.visualPosition_].push(this.buttonDiv_);
            this.controlIndex_ = this.map_.controls[this.visualPosition_].length - 1
        }
    };
    DragZoom.prototype.initControl_ = function (c) {
        var b;
        var a = this;
        b = document.createElement("div");
        b.style.height = this.visualSize_.height + "px";
        b.style.width = this.visualSize_.width + "px";
        b.style.background = "transparent url(" + this.visualSprite_ + ") no-repeat -" + (2 * this.visualSize_.width) + "px 0";
        b.title = this.visualTips_.off;
        b.onclick = function (e) {
            a.hotKeyDown_ = !a.hotKeyDown_;
            if (a.hotKeyDown_) {
                a.buttonDiv_.style.backgroundPosition = -(a.visualSize_.width * 0) + "px 0";
                a.buttonDiv_.title = a.visualTips_.on;
                a.activatedByControl_ = true;
                google.maps.event.trigger(a, "activate")
            } else {
                a.buttonDiv_.style.backgroundPosition = -(a.visualSize_.width * 2) + "px 0";
                a.buttonDiv_.title = a.visualTips_.off;
                google.maps.event.trigger(a, "deactivate")
            }
            a.onMouseMove_(e)
        };
        b.onmouseover = function () {
            a.buttonDiv_.style.backgroundPosition = -(a.visualSize_.width * 1) + "px 0"
        };
        b.onmouseout = function () {
            if (a.hotKeyDown_) {
                a.buttonDiv_.style.backgroundPosition = -(a.visualSize_.width * 0) + "px 0";
                a.buttonDiv_.title = a.visualTips_.on
            } else {
                a.buttonDiv_.style.backgroundPosition = -(a.visualSize_.width * 2) + "px 0";
                a.buttonDiv_.title = a.visualTips_.off
            }
        };
        b.ondragstart = function () {
            return false
        };
        o(b.style, {
            cursor: "pointer",
            marginTop: c.height + "px",
            marginLeft: c.width + "px"
        });
        return b
    };
    DragZoom.prototype.isHotKeyDown_ = function (e) {
        var a;
        e = e || window.event;
        a = (e.shiftKey && this.key_ === "shift") || (e.altKey && this.key_ === "alt") || (e.ctrlKey && this.key_ === "ctrl");
        if (!a) {
            switch (e.keyCode) {
            case 16:
                if (this.key_ === "shift") {
                    a = true
                }
                break;
            case 17:
                if (this.key_ === "ctrl") {
                    a = true
                }
                break;
            case 18:
                if (this.key_ === "alt") {
                    a = true
                }
                break
            }
        }
        //a = true;	// Added later
        return a
    };
    DragZoom.prototype.isMouseOnMap_ = function () {
        var c = this.mousePosn_;
        if (c) {
            var b = this.mapPosn_;
            var a = this.map_.getDiv();
            return c.left > b.left && c.left < (b.left + a.offsetWidth) && c.top > b.top && c.top < (b.top + a.offsetHeight)
        } else {
            return false
        }
    };
    DragZoom.prototype.setVeilVisibility_ = function () {
        var i;
        if (this.map_ && this.hotKeyDown_ && this.isMouseOnMap_()) {
            var d = this.map_.getDiv();
            this.mapWidth_ = d.offsetWidth - (this.borderWidths_.left + this.borderWidths_.right);
            this.mapHeight_ = d.offsetHeight - (this.borderWidths_.top + this.borderWidths_.bottom);
            if (this.activatedByControl_) {
                var a = parseInt(this.buttonDiv_.style.left, 10) + this.visualPositionOffset_.width;
                var b = parseInt(this.buttonDiv_.style.top, 10) + this.visualPositionOffset_.height;
                var c = this.visualSize_.width;
                var e = this.visualSize_.height;
                this.veilDiv_[0].style.top = "0px";
                this.veilDiv_[0].style.left = "0px";
                this.veilDiv_[0].style.width = a + "px";
                this.veilDiv_[0].style.height = this.mapHeight_ + "px";
                this.veilDiv_[1].style.top = "0px";
                this.veilDiv_[1].style.left = (a + c) + "px";
                this.veilDiv_[1].style.width = (this.mapWidth_ - (a + c)) + "px";
                this.veilDiv_[1].style.height = this.mapHeight_ + "px";
                this.veilDiv_[2].style.top = "0px";
                this.veilDiv_[2].style.left = a + "px";
                this.veilDiv_[2].style.width = c + "px";
                this.veilDiv_[2].style.height = b + "px";
                this.veilDiv_[3].style.top = (b + e) + "px";
                this.veilDiv_[3].style.left = a + "px";
                this.veilDiv_[3].style.width = c + "px";
                this.veilDiv_[3].style.height = (this.mapHeight_ - (b + e)) + "px";
                for (i = 0; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.display = "block"
                }
            } else {
                this.veilDiv_[0].style.left = "0px";
                this.veilDiv_[0].style.top = "0px";
                this.veilDiv_[0].style.width = this.mapWidth_ + "px";
                this.veilDiv_[0].style.height = this.mapHeight_ + "px";
                for (i = 1; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.width = "0px";
                    this.veilDiv_[i].style.height = "0px"
                }
                for (i = 0; i < this.veilDiv_.length; i++) {
                    this.veilDiv_[i].style.display = "block"
                }
            }
        } else {
            for (i = 0; i < this.veilDiv_.length; i++) {
                this.veilDiv_[i].style.display = "none"
            }
        }
    };
    DragZoom.prototype.onKeyDown_ = function (e) {
        if (this.map_ && !this.hotKeyDown_ && this.isHotKeyDown_(e)) {
            this.mapPosn_ = n(this.map_.getDiv());
            this.hotKeyDown_ = true;
            this.activatedByControl_ = false;
            this.setVeilVisibility_();
            google.maps.event.trigger(this, "activate")
        }
        if (this.visualEnabled_ && this.isHotKeyDown_(e)) {
            this.buttonDiv_.style.display = "none"
        }
    };
    DragZoom.prototype.getMousePoint_ = function (e) {
        var a = q(e);
        var p = new google.maps.Point();
        p.x = a.left - this.mapPosn_.left - this.borderWidths_.left;
        p.y = a.top - this.mapPosn_.top - this.borderWidths_.top;
        p.x = Math.min(p.x, this.mapWidth_);
        p.y = Math.min(p.y, this.mapHeight_);
        p.x = Math.max(p.x, 0);
        p.y = Math.max(p.y, 0);
        return p
    };
    DragZoom.prototype.onMouseDown_ = function (e) {
        if (this.map_ && this.hotKeyDown_) {
            this.mapPosn_ = n(this.map_.getDiv());
            this.dragging_ = true;
            this.startPt_ = this.endPt_ = this.getMousePoint_(e);
            this.boxDiv_.style.width = this.boxDiv_.style.height = "0px";
            var a = this.prjov_.getProjection();
            var b = a.fromContainerPixelToLatLng(this.startPt_);
            if (this.visualEnabled_) {
                this.buttonDiv_.style.display = "none"
            }
            google.maps.event.trigger(this, "dragstart", b)
        }
    };
    DragZoom.prototype.onMouseDownDocument_ = function (e) {
        this.mouseDown_ = true
    };
    DragZoom.prototype.onMouseMove_ = function (e) {
        this.mousePosn_ = q(e);
        if (this.dragging_) {
            this.endPt_ = this.getMousePoint_(e);
            var b = Math.min(this.startPt_.x, this.endPt_.x);
            var a = Math.min(this.startPt_.y, this.endPt_.y);
            var c = Math.abs(this.startPt_.x - this.endPt_.x);
            var d = Math.abs(this.startPt_.y - this.endPt_.y);
            this.veilDiv_[0].style.top = "0px";
            this.veilDiv_[0].style.left = "0px";
            this.veilDiv_[0].style.width = b + "px";
            this.veilDiv_[0].style.height = this.mapHeight_ + "px";
            this.veilDiv_[1].style.top = "0px";
            this.veilDiv_[1].style.left = (b + c) + "px";
            this.veilDiv_[1].style.width = (this.mapWidth_ - (b + c)) + "px";
            this.veilDiv_[1].style.height = this.mapHeight_ + "px";
            this.veilDiv_[2].style.top = "0px";
            this.veilDiv_[2].style.left = b + "px";
            this.veilDiv_[2].style.width = c + "px";
            this.veilDiv_[2].style.height = a + "px";
            this.veilDiv_[3].style.top = (a + d) + "px";
            this.veilDiv_[3].style.left = b + "px";
            this.veilDiv_[3].style.width = c + "px";
            this.veilDiv_[3].style.height = (this.mapHeight_ - (a + d)) + "px";
            this.boxDiv_.style.top = a + "px";
            this.boxDiv_.style.left = b + "px";
            this.boxDiv_.style.width = (c - (this.boxBorderWidths_.left + this.boxBorderWidths_.right)) + "px";
            this.boxDiv_.style.height = (d - (this.boxBorderWidths_.top + this.boxBorderWidths_.bottom)) + "px";
            this.boxDiv_.style.display = "block";
            google.maps.event.trigger(this, "drag", new google.maps.Point(b, a + d), new google.maps.Point(b + c, a), this.prjov_.getProjection())
        } else if (!this.mouseDown_) {
            this.mapPosn_ = n(this.map_.getDiv());
            this.setVeilVisibility_()
        }
    };
    
    DragZoom.prototype.onMouseUp_ = function (e) {
        var z;
        var g = this;
        this.mouseDown_ = false;
        if (this.dragging_) {
            var k = Math.min(this.startPt_.x, this.endPt_.x);
            var f = Math.min(this.startPt_.y, this.endPt_.y);
            var l = Math.abs(this.startPt_.x - this.endPt_.x);
            var b = Math.abs(this.startPt_.y - this.endPt_.y);
            var c = true;
            if (c) {
                k += this.borderWidths_.left;
                f += this.borderWidths_.top
            }
            var m = this.prjov_.getProjection();
            var d = m.fromContainerPixelToLatLng(new google.maps.Point(k, f + b));
            var j = m.fromContainerPixelToLatLng(new google.maps.Point(k + l, f));
            var h = new google.maps.LatLngBounds(d, j);
            
            // d and j hold the coordinates.
			northWest = [j.nb, d.ob];
			southEast = [d.nb, j.ob];	
			points = [northWest, southEast];
			
			
			
			// You've got the boundary coordinates. Do whatever you like with them.
			//console.log(JSON.stringify(points));
			$('.drag-coordinates').text(JSON.stringify(points));
			
					
			setTimeout(function () {
                g.boxDiv_.style.display = "none"
            }, 500);
            this.dragging_ = false;
            this.onMouseMove_(e);
            google.maps.event.trigger(this, "dragend", h);
            if (!this.isHotKeyDown_(e)) {
                this.onKeyUp_(e)
            }
		
		}

    };
    
    DragZoom.prototype.onKeyUp_ = function (e) {
        var i;
        if (this.map_ && this.hotKeyDown_) {
            this.hotKeyDown_ = false;
            if (this.dragging_) {
                this.boxDiv_.style.display = "none";
                this.dragging_ = false
            }
            for (i = 0; i < this.veilDiv_.length; i++) {
                this.veilDiv_[i].style.display = "none"
            }
            if (this.visualEnabled_) {
                this.buttonDiv_.style.backgroundPosition = -(this.visualSize_.height * 2) + "px 0";
                this.buttonDiv_.title = this.visualTips_.off;
                this.buttonDiv_.style.display = ""
            }
            google.maps.event.trigger(this, "deactivate")
        }
    };
    google.maps.Map.prototype.enableKeyDragZoom = function (a) {
        this.dragZoom_ = new DragZoom(this, a)
    };
    google.maps.Map.prototype.disableKeyDragZoom = function () {
        var i;
        var d = this.dragZoom_;
        if (d) {
            for (i = 0; i < this.listeners_.length; ++i) {
                google.maps.event.removeListener(d.listeners_[i])
            }
            this.getDiv().removeChild(d.boxDiv_);
            for (i = 0; i < d.veilDiv_.length; i++) {
                this.getDiv().removeChild(d.veilDiv_[i])
            }
            if (d.visualEnabled_) {
                this.controls[d.visualPosition_].removeAt(d.controlIndex_)
            }
            d.prjov_.setMap(null);
            this.dragZoom_ = null
        }
    };
    google.maps.Map.prototype.keyDragZoomEnabled = function () {
        return this.dragZoom_ !== null
    };
    google.maps.Map.prototype.getDragZoomObject = function () {
        return this.dragZoom_
    }
})();
