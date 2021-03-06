function VideoPlayer(_main){
    this.main = _main;
    this.thePlayer = null;
    this.curFilter = "";
    this.resultsArr = [];
    this.curVideoIndx = 0;
    this.addPlayer();
	this.MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
VideoPlayer.prototype.addPlayer = function(){
    console.log("addPlayer");
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onPlayerReady(event) {
    //console.log("zz-onPlayerReady: %o", this);
    var latLongObj = {lat:22.895691687705654, lng:113.9501953125};
    main.videoPlayer.thePlayer.mute();
}
function onPlayerStateChange(event) {
    this.main.middleBar.handlePausePlayBtn();
}
function stopVideo() {
    main.videoPlayer.thePlayer.stopVideo();
}
function onYouTubeIframeAPIReady() {
    console.log("<<>>player");
    main.videoPlayer.thePlayer = new YT.Player('videoPlayerDiv', {
                height: '390',
                width: '640',
                iv_load_policy:3,
                //videoId: 'lEM-d7n6kxE', // balto riots
                //videoId: 'Fobn1PLwExM', // tuba city
                //videoId: 'a9KZ3jgbbmI', // fireworks
                playerVars: {
                    modestbranding: true,
                    iv_load_policy:3,
                    showinfo:0
                },
                //videoId: "UtblXY7Lg4k",
                events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
    });
}

VideoPlayer.prototype.playVideo = function(){
    this.thePlayer.playVideo();
}
VideoPlayer.prototype.playVideoId = function(_id){
    console.log("_id: " + _id);
    this.thePlayer.loadVideoById(_id, 5);
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


VideoPlayer.prototype.searchYouTubeByLoc = function(_latLongObj, _searchType, _searchTerm){
    var _self = this;

    //console.log("gapi %o: ", gapi);
    console.log(">>> _latLongObj: %o", _latLongObj);
    console.log("radius: " + this.main.mapView.zoomArr[this.main.mapView.map.getZoom()]);
    console.log("_searchType: %o", _searchType);

    if(_searchType == "filter"){
        try{
            // split it to take away everything after first comma
            if(_searchTerm != undefined){
                var filter = _searchTerm;
            }
            else{
                var filter = $("#pac-input").val().split(',')[0];
            }

            var part1 = filter.split(',')[0];
            var part2 = "";
            if(filter.split(',').length > 1){
                part2 = filter.split(',')[1];
            }
            this.curFilter = filter;
            console.log("+======searching youtube (filter) for q: " + filter);
            console.log("publishedAfter: %o", this.main.controlBar.curPublishedAfter);
            
            var request = gapi.client.youtube.search.list({
                q: filter,
                order: (filter != "" ? "relevance" : "viewCount"),
                type: "video",
                part: "id,snippet",
                maxResults: "30",
                //eventType: "live",
                //videoLiscense: "", //inputObject.videoLiscense,
                safeSearch:"none",
                location: _latLongObj.lat + "," + _latLongObj.lng,
                locationRadius: this.main.mapView.zoomArr[this.main.mapView.map.getZoom()],
                //locationRadius: "17000m",
                //publishedAfter: '2013-07-01T00:00:00Z',
                publishedAfter: this.main.controlBar.curPublishedAfter,
                publishedBefore: moment().format(),
                key: "AIzaSyDlPrs2egoZrLaWiYzG_qAx88PpeDin5oE"
            });
        } 
        catch(err){
            console.log("err: " + err);
        }
    }
    else
    if(_searchType == "place"){
        try{
            // split it to take away everything after first comma
            var part1 = _searchTerm.split(',')[0].trim();
            var part2 = "";
            var part3 = "";
            if(_searchTerm.split(',').length > 1){
                part2 = _searchTerm.split(',')[1].trim();
            }
            if(_searchTerm.split(',').length > 2){
                part3 = _searchTerm.split(',')[2].trim();
            }
            // boating|sailing -fishing
            var myPlace = 
                    //'"' + part1 + '"' 
                    //+ '|' + 
                    //'"' + part1 + ' ' + part2 + '"'
                    part1 + ' ' + part2
                    //+ '|' + '"' + part1 + ' ' + part2 + ' ' + part3 + '"';
                    //+ ' -' + '"' + part2 + '"';
            console.log("searching youtube (place) for q: " + myPlace);
            console.log("publishedAfter: " + this.main.controlBar.curPublishedAfter);
            var request = gapi.client.youtube.search.list({
                q: myPlace,
                order: "relevance", //date,viewCount
                type: "video",
                part: "id,snippet",
                maxResults: "30",
                //eventType: "live",
                //videoLiscense: "", //inputObject.videoLiscense,
                safeSearch:"none",
                //location: _latLongObj.lat + "," + _latLongObj.lng,
                //locationRadius: this.main.mapView.zoomArr[this.main.mapView.map.getZoom()],
                //publishedAfter: '2014-01-01T00:00:00Z',
                publishedAfter: this.main.controlBar.curPublishedAfter,
                publishedBefore: moment().format(),
                key: "AIzaSyDlPrs2egoZrLaWiYzG_qAx88PpeDin5oE"
            });
        } 
        catch(err){
            console.log("err: " + err);
        }
    }
    console.log("YT request: %o", request);
    request.execute(function(response) {
        _self.resultsArr = [];
        var videoIDString = '';
        console.log("YT response: %o", response);
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
            //videoResult.videoId = entryArr[i].id.videoId;

            //console.log("descrip: " + videoResult.description);
            //console.log("videoId: " + videoResult.videoId);

            var year = entryArr[i].snippet.publishedAt.substr(0, 4);
            var monthNumeric = entryArr[i].snippet.publishedAt.substr(5, 2);
            var monthInt = 0;

            if (monthNumeric.indexOf("0") === 0) {
                monthInt = monthNumeric.substr(1, 1);
            } 
            else{
                monthInt = monthNumeric;
            }

            videoResult.publishedAt = entryArr[i].snippet.publishedAt;

            var day = entryArr[i].snippet.publishedAt.substr(8, 2);
            var time = entryArr[i].snippet.publishedAt.substr(11, 8);

            var monthString = _self.MONTH_NAMES[monthInt - 1];

            //videoResult.displayTimeStamp = monthString + " " + day + ", " 
                                                    //+ year + " - " + time + " UTC";
            videoResult.date = monthString + " " + day + ", " 
                                                    + year;
            videoResult.publishTimeStamp = entryArr[i].snippet.publishedAt;

            //console.log("displayTimeStamp: " + videoResult.displayTimeStamp);
            //console.log("publishTimeStamp: " + videoResult.publishTimeStamp);
            //console.log("desc: " + entryArr[i].snippet.description);
            //console.log("thumb: " + entryArr[i].snippet.thumbnails.high.url);

            //add result to results
            _self.resultsArr.push(videoResult);
        }

        // order by date descending
        /*_self.resultsArr.sort(function(a,b){
            var c = new Date(a.publishedAt);
            var d = new Date(b.publishedAt);
            //return c-d;
            return c>d ? -1 : c<d ? 1 : 0;
        }); */

        if(_self.curVideoIndx >= _self.resultsArr.length){
            _self.curVideoIndx = 0;
        }
        //_self.playVideoId(_self.resultsArr[_self.curVideoIndx++].videoId);
        _self.main.playlist.setPlaylist( _self.resultsArr);
    }
});
}


