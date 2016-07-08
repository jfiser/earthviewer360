function SpeechRecognition(_mapView, _streetView){
    return;
    
    this.mapView = _mapView;
    this.streetView = _streetView;
    if (annyang){
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
            '*tag near me': this.nearMe,
            'address *tag': this.getAddress,
            'show me *tag': this.showMe,
            'hello': this.hello,
            'zoom *tag': this.zoomInOut
            }
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
        console.log("setop mike");
        document.getElementById("txtBox").innerHTML = "setop mike";
}
SpeechRecognition.prototype.zoomInOut = function(_tag){
    //console.log("tag: " + _tag);
    document.getElementById("txtBox").innerHTML = _tag;
    this.mapView.zoomInOut(_tag);
}
SpeechRecognition.prototype.nearMe = function(_tag){
    //console.log("tag: " + _tag);
    document.getElementById("txtBox").innerHTML = _tag;
}
SpeechRecognition.prototype.showMe = function(_tag){
    //console.log("tag: " + _tag);
    document.getElementById("txtBox").innerHTML = _tag;
}

SpeechRecognition.prototype.getAddress = function(_addr){
    document.getElementById("txtBox").innerHTML = _addr;
}
SpeechRecognition.prototype.hello = function(){
    //console.log("tag: " + _tag);
    document.getElementById("txtBox").innerHTML = "hello";
}