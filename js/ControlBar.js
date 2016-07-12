function ControlBar(_main){
    this.main = _main;
}
ControlBar.prototype.filterTxtClicked = function(){
    console.log("zzz");
    this.filterTxt = ($("#filterTxt").val());
}