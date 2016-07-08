function MiddleBar(_main, _mapView, _streetView, _middleBarEl){
    this.main = _main;
    this.mapView = _mapView;
    this.streetView = _streetView;
    this.middleBarEl = _middleBarEl;
    this.setMiddleBarDraggable();
    this.setBtnListeners()
    $(window).resize = function(){
        //resizeMapAndPano(evt);
    }
    
}
MiddleBar.prototype.setMiddleBarDraggable = function(){
    var cur_x = 0, cur_y = 0;
    var $middleBarEl = $("#middleBar");
    var _self = this;

    this.myHammer = new Hammer(this.middleBarEl, {dragLockToAxis: true//,
                                                //dragBlockHorizontal: true
                                            });
                                                
    this.myHammer.on("swipeleft swiperight dragright dragleft dragup dragdown dragstart dragend", function(evt){
        evt.preventDefault();
        // So we don't process mouseEvents here.
        if(evt.gesture == undefined){
           return;
        }
        switch(evt.type){
            case "swipeleft":
                console.log("swipeleft");
                break;
            //case "dragright":
            case "swiperight":
                console.log("swiperight");
                break;
            case "dragstart":
                console.log("dragstart");
                cur_x = $middleBarEl.position().left;
                cur_y = $middleBarEl.position().top;
                break;
            case "dragend":
                //console.log("dragend");
                _self.resizeMapAndPano();
                google.maps.event.trigger(_self.mapView.map, "resize");
                google.maps.event.trigger(_self.streetView.panorama, "resize");
                break;
            case "dragright":
                $middleBarEl.css("left", (cur_x + evt.gesture.deltaX) + "px");
                _self.resizeMapAndPano();
                console.log("deltaX: " + evt.gesture.deltaX);
                break;
            case "dragleft":
                $middleBarEl.css("left", (cur_x + evt.gesture.deltaX) + "px");
                _self.resizeMapAndPano();
                break;
            case "dragup":
                $middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                _self.resizeMapAndPano();
                console.log("deltaX: " + evt.gesture.deltaX);
                break;
            case "dragdown":
                $middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                _self.resizeMapAndPano();
                break;
            }
        });
}
MiddleBar.prototype.setBtnListeners = function(){
    var _self = this;

    $("#playBtn").click(function(){
        if(_self.streetView.panoSpinning){
            _self.streetView.stopSpinPanorama();
            _self.streetView.panoSpinState = "off";
            //$("#playIcon").show();
            //$("#pauseIcon").hide();
        }
        else{
            _self.streetView.startSpinPanorama();
            _self.streetView.panoSpinState = "on";
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
        }
        _self.handlePausePlayBtns();
        console.log("panoState: " + _self.streetView.panoSpinState)
    })
}
MiddleBar.prototype.handlePausePlayBtns = function(){
    if(this.streetView.panoSpinning){
        $("#playIcon").hide();
        $("#pauseIcon").show();
    }
    else{
        $("#playIcon").show();
        $("#pauseIcon").hide();
    }
}

/*MiddleBar.prototype.setMiddleBarDraggable2 = function(){
    var _self = this;

    this.middleBarDrag = Draggable.create("#middleBar", {type:"top,left", 
            //edgeResistance:0.65, 
            //dragResistance:.20,
            //throwResistance:10000,
            //throwProps:true,
            //bounds:{minX: -1100, maxY:1855},
            force3D: false,
            //bounds:{top:0, left:100},
            onDrag:function(evt){      
                evt.preventDefault();
                _self.resizeMapAndPano(evt);
            },
            onDragStart:function(evt){
                //evt.preventDefault();
            },
            onPress:function(evt){
                //console.log("onPress -css(left): " + parseInt($("#middleBar").css("left")));
            },
            onRelease:function(evt){
                //console.log("release this.y: " + this.y);
                google.maps.event.trigger(_self.mapView.map, "resize");
                google.maps.event.trigger(_self.streetView.panorama, "resize");
                //$("#middleBar").y 
            },
            onDragEnd:function(evt){
                _self.resizeMapAndPano(evt);
            },
            //onThrowComplete:testBounds,                             
            lockaxis:true

        });                                     
}*/
MiddleBar.prototype.resizeMapAndPano = function(){
    this.main.windowResize();
    return;
}


