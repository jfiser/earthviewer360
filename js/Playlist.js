function Playlist(_main){
    this.main = _main;
    this.playlistElemArr = [];
    this.initPlaylistHolderHolder();
    this.firstPlaylistLoad = true;
}
Playlist.prototype.initPlaylistHolderHolder = function(){
    TweenLite.set($("#playlistHolderHolder"), {left:$("#pano").width()*-1})
}
Playlist.prototype.setPlaylist = function(_itemsArr){
    var i, item, $el, _self = this;
    
    //this.main.windowResize("Startup playlist resize");

    $(".playlistItem-wide").remove(); // remove last playlist
    $(".playlistItem-grid").remove(); // remove last playlist
    this.playlistElemArr = [];
    $("#playlistHolderHolder").scrollTop(0);
    
    for(i = 0; i < _itemsArr.length; i++){
        item = _itemsArr[i];
        if(this.main.playlistLayout == "grid"){
            $el = $('<div class="playlistItem-grid" style="opacity:0" data-videoid="' 
                    + item.videoId + '" '
                    + 'data-desc="' + item.description +  '" '
                    + 'data-date="' + item.date +  '" '
                    + 'data-title="' + item.title +  '">'
                    + '<img class="videoThumbnail-grid" src="' 
                                        + item.thumbNailURL + '"/>'
                    + '<div class="thumbTxt">' + item.title + '</div>'
                    + '</div>');

            $("#playlistHolder-grid").append($el);
        }
        else{
            var _descToUse = item.description == "" ? item.title : item.description;
            $el = $('<div class="playlistItem-wide" data-videoid="'
                    + item.videoId + '">'
                    + '<img class="videoThumbnail-wide" src="' + item.thumbNailURL + '"/>'
                    + '<p class="thumbTxt-wide">' + _descToUse + '</p>'
                    + '<p class="thumbDate-wide">' + item.date + '</p>'
                    + '</div>');
            $("#playlistHolder").append($el);
        }
        //$el.addClass("noselect");

        this.playlistElemArr.push($el);
        //this.openPlaylist();

        $(".videoThumbnail-grid").on("load", function(){
            TweenLite.to($(this).parent(), 1, {opacity:1});
            if(_self.firstPlaylistLoad == true){
                _self.firstPlaylistLoad = false;
                _self.main.windowResize("Startup playlist resize");
            }
        });

        if(!_self.main.isTouchDevice()){
            $(".playlistItem-grid").on("mouseover", function(){
                $("#infoBox").show();
            })
            $(".playlistItem-grid").on("mouseout", function(){
                $("#infoBox").hide();
            });
            $($el).on("mousemove", function(evt){
                //console.log("mouseo: %o",  evt);//.originalEvent.pageY);
                
                var _descToUse = $(this).data("desc") == "" ? $(this).data("title")
                                                        : $(this).data("desc")
                $("#infoBox").css("top", evt.pageY - ($("#infoBox").height()-30) + "px");
                $("#infoBox").css("left", evt.pageX + 50 + "px");
                
                $("#thumbDate").text($(this).data("date"));
                $("#thumbDesc").text(_descToUse);

                //_self.markFilterInText("#thumbDesc");
                if(_self.main.playlistLayout == "grid"){
                    _self.markFilterInText("#thumbDesc");
                }

            });
                
        }
        // $el[0] - yields the original element ($el is jquery var)
        var tmpHammer = new Hammer($el[0]);
        tmpHammer.on("tap", function(evt){
            evt.preventDefault();
            _self.main.videoPlayer.playVideoId($(this).data("videoid"));
            _self.closePlaylist();
        });

        /*$(this.playlistElemArr[this.playlistElemArr.length-1]).on("click", function(){
            var _apiRequest;

            _self.main.videoPlayer.playVideoId($(this).data("videoid"));
            _self.closePlaylist();
            apiRequest = 'https://www.googleapis.com/youtube/v3/videos?part=recordingDetails'
                            + '&id=' + $(this).data("videoid")
                            + '&key=AIzaSyDlPrs2egoZrLaWiYzG_qAx88PpeDin5oE';

            $.getJSON(apiRequest, function(data){
                console.log("data: %o", data);
                var _lat = data.items[0].recordingDetails.location.latitude;
                var _lng = data.items[0].recordingDetails.location.longitude;
                _self.main.locator.showLatLong({lat:_lat, lng:_lng});
                //_self.main.streetView.setPanorama(null, {lat:_lat, lng:_lng});
            });

        });*/


    }
    this.openPlaylist();

    if(this.main.playlistLayout == "wide"){
        this.markFilterInText(".thumbTxt-wide");
    }
}
Playlist.prototype.markFilterInText = function(_txtElem){
    if(this.main.controlBar.placeOrFilter == "filter" 
                    && this.main.videoPlayer.curFilter != ""){
        try{
            $(_txtElem).wrapInTag({
                //tag: 'strong',
                tag: 'mark',
                //words: ['the','is','have','info','was','and','of','in']
                words: [this.main.videoPlayer.curFilter]
            });
        }
        catch(err){
            console.log("wrapInTag failed: %o", err);
        }
    }
}
Playlist.prototype.imgLoaded = function(evt){

}
Playlist.prototype.closePlaylist = function(){
    this.main.playlistOrVideo = "video";
    TweenLite.to($("#playlistHolderHolder"), .3, 
                                    {left:$("#playlistHolderHolder").width()*-1,
                                    ease:Quad.easeOut })
}
Playlist.prototype.openPlaylist = function(){
    this.main.playlistOrVideo = "playlist";
    TweenLite.to($("#playlistHolderHolder"), .3, 
                                    {left:0, 
                                    ease:Quad.easeOut });
    if(this.main.videoPlayer != undefined){
        this.main.videoPlayer.pauseVideo();
    }
}
