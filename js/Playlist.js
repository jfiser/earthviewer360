function Playlist(_main){
    this.main = _main;
    this.playlistElemArr = [];
    this.initPlaylistHolderHolder();
}
Playlist.prototype.initPlaylistHolderHolder = function(){
    TweenLite.set($("#playlistHolderHolder"), {left:$("#pano").width()*-1})
}
Playlist.prototype.setPlaylist = function(_itemsArr){
    var i, item, $el, _self = this;

    $(".playlistItem").remove(); // remove lsast playlist
    $(".playlistItem-grid").remove(); // remove lsast playlist
    this.playlistElemArr = [];
    $("#playlistHolderHolder").scrollTop(0);
    
    for(i = 0; i < _itemsArr.length; i++){
        item = _itemsArr[i];
        if(this.main.playlistLayout == "grid"){
            $el = $('<div class="playlistItem-grid" style="opacity:0" data-videoId="' + item.videoId +  '">'
                    + '<img class="videoThumbnail-grid" src="' 
                                        + item.thumbNailURL + '"/>'
                    + '<div class="thumbTxt">' + item.title + '</div>'
                    + '</div>');

            $("#playlistHolder-grid").append($el);
        }
        else{
            $el = $('<div class="playlistItem">'
                    + '<img class="videoThumbnail" src="' + item.thumbNailURL + '"/>'
                    + '<div class="thumbTxt">' + item.title + '</div>'
                    + '</div>');
            $("#playlistHolder").append($el);
        }
        this.playlistElemArr.push($el);
        this.openPlaylist();

        $(".videoThumbnail-grid").on("load", function(){
            TweenLite.to($(this).parent(), 1, {opacity:1});
        })

        $(this.playlistElemArr[this.playlistElemArr.length-1]).on("click", function(){
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
}
Playlist.prototype.imgLoaded = function(evt){
}
Playlist.prototype.closePlaylist = function(){
    TweenLite.to($("#playlistHolderHolder"), .5, 
                                    {left:$("#playlistHolderHolder").width()*-1,
                                    ease:Quad.easeOut })
}
Playlist.prototype.openPlaylist = function(){
    TweenLite.to($("#playlistHolderHolder"), .5, 
                                    {left:0, 
                                    ease:Quad.easeOut });
    this.main.videoPlayer.pauseVideo();
}
