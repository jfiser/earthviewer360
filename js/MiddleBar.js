function MiddleBar(_main, _mapView, _streetView, _middleBarEl){
    this.main = _main;
    this.mapView = _mapView;
    this.streetView = _streetView;
    this.middleBarEl = _middleBarEl;
    this.setMiddleBarDraggable();
    this.setBtnListeners()
    //$(window).resize = function(){
        //resizeMapAndPano(evt);
    //}
    
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
                evt.preventDefault();
                evt.stopPropagation();
                evt.gesture.preventDefault();
                //console.log("dragstart");
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
                //console.log("deltaX: " + evt.gesture.deltaX);
                break;
            case "dragleft":
                $middleBarEl.css("left", (cur_x + evt.gesture.deltaX) + "px");
                _self.resizeMapAndPano();
                break;
            case "dragup":
                //evt.preventDefault();
                //evt.stopPropagation();
                if(_self.main.orientation == "vertical"){
                    evt.gesture.preventDefault();
                    $middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                }
                //$middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                _self.resizeMapAndPano();
                //console.log("deltaX: " + evt.gesture.deltaX);
                break;
            case "dragdown":
                //evt.preventDefault();
                //evt.stopPropagation();
                if(_self.main.orientation == "vertical"){
                    evt.gesture.preventDefault();
                    $middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                }
                //$middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
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
        }
        else{
            _self.streetView.startSpinPanorama();
            _self.streetView.panoSpinState = "on";
        }
        _self.handlePausePlayBtns();
        console.log("panoState: " + _self.streetView.panoSpinState)
    });

    $("#homeBtn").click(function(){
        _self.main.locator.showCurrentUserLoc();
    });
    $("#videoBtn").click(function(){
        // was showing video
        if($("#videoPlayerDiv").is(":visible")){
            $("#videoPlayerDiv").hide();
            $("#videoIcon").show();
            $("#panoIcon").hide();
            _self.main.setVideoOrPano("pano");
            _self.main.videoPlayer.pauseVideo();
        }
        else{ // was showing pano
            $("#videoPlayerDiv").show();
            $("#videoIcon").hide();
            $("#panoIcon").show();
            _self.main.setVideoOrPano("video");
            _self.main.streetView.stopSpinPanorama();
        }
    });
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

MiddleBar.prototype.resizeMapAndPano = function(){
    this.main.windowResize("resizeMiddleBar");
}


