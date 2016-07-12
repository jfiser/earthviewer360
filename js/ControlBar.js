function ControlBar(_main){
    this.main = _main;
    this.filterTxt = "";
    this.setListeners();
}
ControlBar.prototype.filterTxtClicked = function(){
    this.filterTxt = ($("#filterTxt").val());
}
ControlBar.prototype.setListeners = function(){
    var _self = this;
    document.getElementById("filterTxt").addEventListener("keypress", function (evt) {
        if (evt.keyCode === 13)   {
            $("#filterSubmitBtn").click();
            evt.preventDefault(); // <<< Most important missing piece from icedwater
            _self.filterTxt = ($("#filterTxt").val());
            console.log("filterTxt: " + _self.filterTxt);
        }
    });
}
