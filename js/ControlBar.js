function ControlBar(_main){
    this.main = _main;
    this.placeOrFilter = "place";
    this.curPublishedAfter = "2007-07-01T00:00:00Z";
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
ControlBar.prototype.setListeners = function(){
    var _self = this;
    $('#personPlaceRadioBtns input').on('change', function(){
        _self.placeOrFilter = $('input[name=personOrPlace]:checked', 
                                            '#personPlaceRadioBtns').val();
        if(_self.placeOrFilter == "place"){
            $("#pac-input").attr("placeholder", "ex: Mexican food near me or Alcatraz");       
        }
        else{
            $("#pac-input").attr("placeholder", "ex: music or dog or Trump");       
        }
        //$('#pac-input').val('');
        console.log("radio: " + _self.placeOrFilter); 
    });
}
