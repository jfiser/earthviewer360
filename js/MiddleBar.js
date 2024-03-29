function MiddleBar(_main, _mapView, _streetView, _middleBarEl){
    this.main = _main;
    this.mapView = _mapView;
    this.curViewConfig = "pano|video"; // pano|video, video, pano
    this.streetView = _streetView;
    this.middleBarEl = _middleBarEl;
    this.setMiddleBarDraggable();
    this.setBtnListeners();
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
                                                
    //this.myHammer.on("touch swipeleft swiperight dragright dragleft dragup dragdown dragstart dragend", function(evt){
    this.myHammer.on("touch release dragright dragleft dragup dragdown dragstart dragend", function(evt){
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
                //$("#videoPlayerCover").css("opacity", 0);
                $("#videoPlayerCover").show();
                evt.preventDefault();
                evt.stopPropagation();
                evt.gesture.preventDefault();
                console.log("dragstart");
                cur_x = $middleBarEl.position().left;
                cur_y = $middleBarEl.position().top;
                break;
            case "dragend":
                console.log("dragend");
                $("#videoPlayerCover").hide();
                //$("#videoPlayerCover").css("opacity", 0);
                _self.resizeMapAndPano();
                google.maps.event.trigger(_self.mapView.map, "resize");
                google.maps.event.trigger(_self.streetView.panorama, "resize");
                break;
            case "dragright":
                //$("#videoPlayerCover").hide();
                //$("#videoPlayerCover").css("opacity", 0);
                $middleBarEl.css("left", (cur_x + evt.gesture.deltaX) + "px");
                _self.resizeMapAndPano();
                //console.log("deltaX: " + evt.gesture.deltaX);
                //console.log("dragright");
                break;
            case "dragleft":
                //$("#videoPlayerCover").css("opacity", 0);
                //$("#videoPlayerCover").show();
                $middleBarEl.css("left", (cur_x + evt.gesture.deltaX) + "px");
                _self.resizeMapAndPano();
                //console.log("dragleft");
                break;
            case "dragup":
                //$("#videoPlayerCover").css("opacity", 0);
                //$("#videoPlayerCover").show();
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
                if(_self.main.orientation == "vertical"){
                    evt.gesture.preventDefault();
                    $middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                }
                //$middleBarEl.css("top", (cur_y + evt.gesture.deltaY) + "px");
                _self.resizeMapAndPano();
                break;
            case "touch":
                //$("#videoPlayerCover").css("opacity", 0);
                $("#videoPlayerCover").show();
                break;
            case "release":
                $("#videoPlayerCover").hide();
                //$("#videoPlayerCover").css("opacity", 0);
                break;
            }
        });
}
MiddleBar.prototype.setBtnListeners = function(){
    var _self = this;

    $("#playBtn").click(function(){
        if(_self.main.getVideoOrPano() == "pano"){
            if(_self.streetView.panoSpinning){
                _self.streetView.stopSpinPanorama();
                _self.streetView.panoSpinState = "off";
            }
            else{
                _self.streetView.startSpinPanorama();
                _self.streetView.panoSpinState = "on";
            }
            _self.handlePausePlayBtn();
        }
        else // video state
        if(_self.main.getVideoOrPano() == "video"){
            _self.main.videoPlayer.playPauseClick();
        }
    });

    $("#homeBtn").click(function(){
        _self.main.locator.tryToGetUserLoc();
    });
    // switch between pano and video
    $("#videoBtn").click(function(){
        // was showing video
        /*if($("#videoPlayerDiv").is(":visible")){
            $("#videoPlayerDiv").hide();
            $("#videoPlayerCover").hide();
            $("#videoIcon").show();
            $("#panoIcon").hide();
            _self.main.setVideoOrPano("pano");
            _self.main.videoPlayer.pauseVideo();
        }
        else{ // was showing pano
            $("#videoPlayerDiv").show();
            $("#videoPlayerCover").hide();
            $("#videoIcon").hide();
            $("#panoIcon").show();
            _self.main.setVideoOrPano("video");
            _self.main.streetView.stopSpinPanorama();
        }*/

        _self.toggleViewConfig.bind(_self)();
        _self.handlePausePlayBtn();
    });
}
MiddleBar.prototype.toggleViewConfig = function(_newCnfig){
    switch(this.curViewConfig){
        case "pano|video": this.setViewConfig("pano");
            break;
        case "pano": this.setViewConfig("video");
            break;
        case "video": this.setViewConfig("pano|video");
            break;
    }
}
// set pano view to video, pano or both
MiddleBar.prototype.setViewConfig = function(_newConfig){
    switch(_newConfig){
        case "pano":
            $("#panoHolder").css("height", "100%");
            $("#panoHolder").css("top", "0%");
            $("#panoHolder").show();
            $("#videoHolder").hide();
            $("#videoShadowDiv").hide();
            this.curViewConfig = "pano";
            break;
        case "video":
            $("#panoHolder").hide();
            $("#videoHolder").css("height", "100%");
            $("#videoHolder").css("top", "0%");
            $("#videoHolder").show();
            this.curViewConfig = "video";
            $("#videoShadowDiv").hide();
            break;
        case "pano|video":
            $("#panoHolder").css("height", "43%");
            $("#panoHolder").css("top", "0%");
            $("#videoHolder").css("height", "51%");
            $("#videoHolder").css("bottom", "0%");
            $("#videoHolder").css("top", "auto");
            $("#panoHolder").show();
            $("#videoHolder").show();
            this.curViewConfig = "pano|video";
            $("#videoShadowDiv").show();
            break;
    }
    google.maps.event.trigger(this.mapView.map, "resize");
    google.maps.event.trigger(this.streetView.panorama, "resize");
}
MiddleBar.prototype.handlePausePlayBtn = function(_reason){
    //console.log("reason: " + _reason);
    if(this.main.getVideoOrPano() == "pano"){
        if(this.streetView.panoSpinning){
            $("#playIcon").hide();
            $("#pauseIcon").show();
        }
        else{
            $("#playIcon").show();
            $("#pauseIcon").hide();
        }
    }
    else
    if(this.main.getVideoOrPano() == "video"){
        if(this.main.videoPlayer.thePlayer != undefined){
            var _playerState = this.main.videoPlayer.thePlayer.getPlayerState();
        }
        else{
            return;
        }
        // -1 - unstarted, 0 - ended, 1 - playing, 2 - paused, 3 buffering
        switch(_playerState){
            case -1: 
                $("#playIcon").hide();
                $("#pauseIcon").show();
                break;
            case YT.PlayerState.ENDED:
                $("#playIcon").show();
                $("#pauseIcon").hide();
                console.log("ENDED")
                break;
            case YT.PlayerState.PLAYING: 
                $("#playIcon").hide();
                $("#pauseIcon").show();
                console.log("PLAYING")
                break;
            case YT.PlayerState.PAUSED: 
                $("#playIcon").show();
                $("#pauseIcon").hide();
                console.log("PAUSED")
                break;
            case YT.PlayerState.BUFFERING: 
                console.log("buffering - handle this");
                break;
            case YT.PlayerState.CUED: 
                $("#playIcon").show();
                $("#pauseIcon").hide();
                console.log("CUED")
                break;
            default: console.log("playerState: " + _playerState);
                break;
        }
    }
}
MiddleBar.prototype.resizeMapAndPano = function(){
    this.main.windowResize("resizeMiddleBar");
}


