function ControlBar(_main){
    this.main = _main;
    this.filterTxt = "";
    this.curPubStartDate = "2013-07-01T00:00:00Z";
    this.setListeners();
    this.addDatePicker();
}
ControlBar.prototype.addDatePicker = function(){
    var _self = this;
    //var field = document.getElementById("datePicker");
    //console.log("field: " + field)
    var picker = new Pikaday({
        field: document.getElementById('datePicker'),
        onSelect: function(date){
            //field.value = picker.toString();
            var datePicked = picker.toString();
            console.log("datePicked: " + datePicked);
            _self.curPublishedAfter = moment(datePicked).format();
            console.log("pubAfter: " + _self.curPublishedAfter);
        }
    });
    //field.parentNode.insertBefore(picker.el, field.nextSibling);
}
ControlBar.prototype.filterTxtClicked = function(){
    this.filterTxt = ($("#filterTxt").val());
    if(this.main.getVideoOrPano() == "video"){
        this.main.videoPlayer.searchYouTubeByLoc(this.main.myLatLongObj, "personThing");
    }
}
ControlBar.prototype.setListeners = function(){
    var _self = this;
    /*document.getElementById("filterTxt").addEventListener("keypress", function (evt) {
        if (evt.keyCode === 13)   {
            $("#filterSubmitBtn").click();
            evt.preventDefault(); // <<< Most important missing piece from icedwater
            _self.filterTxt = ($("#filterTxt").val());
            console.log("filterTxt: " + _self.filterTxt);
            if(_self.main.getVideoOrPano() == "video"){
                _self.main.videoPlayer.searchYouTubeByLoc(_self.main.myLatLongObj, "personThing");
            }
        }
    });*/
    $('#personPlaceRadioBtns input').on('change', function() {
        console.log("radio: " + $('input[name=personOrPlace]:checked', '#personPlaceRadioBtns').val()); 
    });
}
