function Main(_latLongObj){
    this.streetView = new StreetView(this, _latLongObj);
    this.mapView = new MapView(this, _latLongObj, this.streetView);
    this.searchPlaces = new SearchPlaces(input, this.mapView.map, this.streetView);
    this.speechRecog = new SpeechRecognition(this.streetView);
    this.middleBar = new MiddleBar(this, this.mapView, this.streetView, 
                                        document.getElementById('middleBar'));
    this.mapView.addSearchPlaces(this.searchPlaces);
    this.handleTouchDevices();
    var _self = this;

    this.setListeners();
    this.windowResize("Startup window resize");
}
Main.prototype.setListeners = function(){
    var _self = this;

    window.addEventListener('orientationchange', function()
        {
            switch(window.orientation) 
            {  
            case -90:
            case 90:
                console.log('landscape');
                break; 
            default:
                console.log('portrait');
                break; 
            }
            _self.windowResize("orientationchange");
        });

    $(window).resize(function(){
        _self.windowResize("window Resize event");
    });
}
Main.prototype.handleTouchDevices = function(){
    if(this.isTouchDevice()){
        $(".tooltiptext").css("visibility", "hidden");
    }  
}
Main.prototype.windowResize = function(_reason){
    var reason = _reason;
    console.log("reason: " + reason);
    /*var spaceAvailable = $(window).height() - $("#topNav").height();

    if($(window).height() > ($("#topNav").height() + $("#mainHolder").height())){
        $("#mainHolder").height(spaceAvailable + "px");
    }*/

    // horizontal    
    if($("#mainHolder").width() > $("#mainHolder").height()){
        if(this.orientation == "vertical"){ // just switched from vertical orientation to horiz
                //this.middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                //* $("#mainHolder").height();
                this.middleBarLoc = .5 * $("#mainHolder").width();
        }
        else{
            console.log("reason: " + reason);
            if(reason == "resizeMiddleBar"){
                this.middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                * $("#mainHolder").width();
            }
            else{
                this.middleBarLoc = .5 * $("#mainHolder").width();
            }
        }
        this.orientation = "horizontal";
        $("#pano").width(this.middleBarLoc);
        $("#pano").height("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").width("43px");
        $("#middleBar").height("100%");
        $("#middleBar").css("left", this.middleBarLoc);
        $("#middleBar").css("top", 0);

        $("#map").width($("#mainHolder").width() 
                            - this.middleBarLoc 
                            - $("#middleBar").width());
        $("#map").height("100%");
        //$("#map").css("left", auto);
        $("#map").css("left", "auto");
        $("#map").css("bottom", "auto");
        $("#map").css("right", 0);
        $("#map").css("top", 0);
    }
    else{  // vertical
        if(this.orientation == "horizontal"){ // just switched from horiz orientation to vert
            //this.middleBarLoc = parseInt($("#middleBar").css("left")) / $("#mainHolder").width()
                                                //* $("#mainHolder").width();
                this.middleBarLoc = .5 * $("#mainHolder").height();
        }
        else{
            if(reason == "resizeMiddleBar"){
                this.middleBarLoc = parseInt($("#middleBar").css("top")) / $("#mainHolder").height()
                                                * $("#mainHolder").height();
            }
            else{
                this.middleBarLoc = .5 * $("#mainHolder").height();
            }
        }        
        this.orientation = "vertical";
        $("#pano").height(this.middleBarLoc);
        $("#pano").width("100%");
        $("#pano").css("left", 0);
        $("#pano").css("top", 0);

        $("#middleBar").height("43px");
        $("#middleBar").width("100%");
        $("#middleBar").css("top", this.middleBarLoc);
        $("#middleBar").css("left", 0);
        
        //console.log("b4 mainHolder: " + $("#mainHolder").height());
        //console.log("b4 middleBar_t: " + $("#middleBar").css("top"));

        $("#map").height($("#mainHolder").height() 
                            - $("#middleBar").height() 
                            - this.middleBarLoc);
        console.log("after middle_t: " + $("#middleBar").css("top"));
        console.log("mappp_h: " + $("#map").height());
        $("#map").width("100%");

        $("#map").css("top", "auto");
        $("#map").css("right", "auto");
        $("#map").css("left", 0);
        $("#map").css("bottom", 0);
    }
}
Main.prototype.isTouchDevice = function(){
  var bool = 'ontouchstart' in window || navigator.maxTouchPoints;
  console.log("touch?: " + bool);
  return(bool); 
};
