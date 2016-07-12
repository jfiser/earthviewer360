function VideoPlayer(_main){
    this.main = _main;
    this.thePlayer = null;
    this.resultsArr = [];
    this.curVideoIndx = 0;
    this.addPlayer();

}
VideoPlayer.prototype.addPlayer = function(){
    console.log("addPlayer");
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    /*$("#videoPlayerCover").click(function(evt){
        //_self.;
    });*/
}
VideoPlayer.prototype.playVideo = function(){
    this.thePlayer.playVideo();
}
VideoPlayer.prototype.playVideoId = function(_id){
    console.log("_id: " + _id);
    this.thePlayer.loadVideoById(_id);
}
VideoPlayer.prototype.pauseVideo = function(){
    this.thePlayer.pauseVideo();
}
// -1 - unstarted, 0 - ended, 1 - playing, 2 - paused, 3 buffering
// Have to change the play/pause icon here because there's a delay from when
// user clicks and the state changes
VideoPlayer.prototype.playPauseClick = function(){
    var _playerState = this.thePlayer.getPlayerState();
    switch(_playerState){
        case -1: 
            this.playVideo();
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
            break;
        case YT.PlayerState.ENDED: 
            this.playVideo();
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
            console.log("playPauseClick 0");
            break;
        case YT.PlayerState.PLAYING: 
            //$("#playIcon").show();
            //$("#pauseIcon").hide();
            this.pauseVideo();
            console.log("playPauseClick 1");
            break;
        case YT.PlayerState.PAUSED:
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
            this.playVideo();
            console.log("playPauseClick 2");
            break;
        case YT.PlayerState.BUFFERING:
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
            console.log("buffering - handle this");
            break;
        case YT.PlayerState.CUED: 
            //$("#playIcon").hide();
            //$("#pauseIcon").show();
            this.playVideo();
            console.log("playPauseClick 5")
            break;
        default: console.log("playerState: " + _playerState);
            break;
    }
}
function onYouTubeIframeAPIReady() {
    console.log("<<>>player");
    main.videoPlayer.thePlayer = new YT.Player('videoPlayerDiv', {
                height: '390',
                width: '640',
                videoId: 'uHNCv0kUH38',
                //videoId: "UtblXY7Lg4k",
                events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
    });
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    //console.log("zz-onPlayerReady: %o", this);
    var latLongObj = {lat:22.895691687705654, lng:113.9501953125};

    //main.videoPlayer.searchYouTubeByLoc(latLongObj);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    this.main.middleBar.handlePausePlayBtn();
}
function stopVideo() {
    main.videoPlayer.thePlayer.stopVideo();
}


VideoPlayer.prototype.searchYouTubeByLoc = function(_latLongObj){
    var _self = this;

    console.log("gapi %o: ", gapi)
    try {
        var request = gapi.client.youtube.search.list({
            //q: "politics|music|art|movies|sports", 
            //q: "trump|clinton|", 
            //q: "travel",
            //q: "",
            q: this.main.controlBar.filterTxt,
            order: "rating",
            type: "video",
            part: "id,snippet",
            maxResults: "10",
            //eventType: "live",
            videoLiscense: "", //inputObject.videoLiscense,
            safeSearch:"none",
            //videoEmbeddable: true, //inputObject.videoEmbeddable,
            location: _latLongObj.lat + "," + _latLongObj.lng,
            //location: "40.73685214795608, -73.99154663085938",
            locationRadius: "40mi",
            publishedAfter: '2013-07-01T00:00:00Z',
            publishedBefore: '2016-09-01T00:00:00Z',
            key: "AIzaSyDlPrs2egoZrLaWiYzG_qAx88PpeDin5oE"
            //key: "AIzaSyAEcfhZe0akd47CTYaEOWQ1bLCCbLUfVEY"
        });
    } 
    catch(err){
        //cannot search via the YouTube API
        console.log("err: " + err);
    }
    console.log("request: %o", request);
    request.execute(function(response) {
        _self.resultsArr = [];
        var videoIDString = '';
        console.log("response: %o", response);
        //if the result object from the response is null, show error; if its empty, remove old results and display
        //message on how to broaden search to get more results.
        if('error' in response || !response){
            console.log("no connect");
        }
        else 
        if (!response.result || !response.result.items) {
            console.log("found 0");
        }
        else{
        var entryArr = response.result.items;
        for (var i = 0; i < entryArr.length; i++) {
            var videoResult = new Object();
            videoResult.title = entryArr[i].snippet.title;

            //Pull the lattitude and longitude data per search result
            /*if ((inputObject.hasSearchLocation) && entryArr[i].georss$where) {
            var latlong = entryArr[i].georss$where.gml$Point.gml$pos.$t;
            var latlongArr = latlong.split(' ');
            videoResult.lat = latlongArr[0].trim();
            videoResult.long = latlongArr[1].trim();
            }*/

            videoResult.videoId = entryArr[i].id.videoId;
            videoIDString = videoIDString + videoResult.videoId + ",";

            videoResult.url = "https://www.youtube.com/watch?v=" + videoResult.videoId;
            videoResult.channelID = entryArr[i].snippet.channelId;
            videoResult.channel = entryArr[i].snippet.channelTitle;
            videoResult.liveBroadcastContent = entryArr[i].snippet.liveBroadcastContent;
            videoResult.thumbNailURL = entryArr[i].snippet.thumbnails.default.url;
            videoResult.description = entryArr[i].snippet.description;
            videoResult.videoId = entryArr[i].id.videoId;

            console.log("descrip: " + videoResult.description);
            console.log("videoId: " + videoResult.videoId);

            var year = entryArr[i].snippet.publishedAt.substr(0, 4);
            var monthNumeric = entryArr[i].snippet.publishedAt.substr(5, 2);
            var monthInt = 0;

            if (monthNumeric.indexOf("0") === 0) {
            monthInt = monthNumeric.substr(1, 1);
            } 
            else{
            monthInt = monthNumeric;
            }
            var day = entryArr[i].snippet.publishedAt.substr(8, 2);
            var time = entryArr[i].snippet.publishedAt.substr(11, 8);

            //var monthString = MONTH_NAMES[monthInt - 1];

            //videoResult.displayTimeStamp = monthString + " " + day + ", " 
                                                    //+ year + " - " + time + " UTC";
            //videoResult.publishTimeStamp = entryArr[i].snippet.publishedAt;

            //add result to results
            _self.resultsArr.push(videoResult);
        }
        if(_self.curVideoIndx >= _self.resultsArr.length){
            _self.curVideoIndx = 0;
        }
        console.log("curVideoIndx: " + _self.curVideoIndx);
        _self.playVideoId(_self.resultsArr[_self.curVideoIndx++].videoId);
    }
});
}


