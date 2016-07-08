<div style="width:1000px; height:600px;" id="canvas_streetviewpanorama"></div>
<script type="text/javascript">
  // CHANGE THE BELOW URL BETWEEN THE QUOTES
  var embed_url = "https://maps.google.com/maps?q=1516+W+Arthur+Ave,+Chicago,+IL&hl=en&ll=41.999942,-87.668645&spn=0.010796,0.020363&sll=41.999949,-87.668677&layer=c&cbp=13,289.04,,0,13.77&cbll=41.999936,-87.668635&hnear=1516+W+Arthur+Ave,+Chicago,+Illinois+60626&t=m&z=16&iwloc=A&panoid=HAvjga5mCucRKAGYvRxy0g";
  // CHANGE THE ABOVE URL BETWEEN THE QUOTES
  
  function getUrlVars(url) {
      var vars = [], hash;
      var hashes = url.slice(url.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
  }
  
  function getUrlVar(url, name) {
      return getUrlVars(url)[name];
  }	
  
  var latlong = getUrlVar(embed_url, 'll').split(',');
  // #################
  // LOCATION SETTINGS
  // #################
  var latitude = parseFloat(latlong[0]);
  var longitude = parseFloat(latlong[1]);
  var panoid = getUrlVar(embed_url, 'panoid');
  
  // #############
  // MORE SETTINGS
  // #############
  
  var zoom = 1.1;
  // increment controls the speed of panning
  // positive values pan to the right, negatives values pan to the left
  var increment = 0.2;
  var interval = 30;
  var chevrons = false;
  var closebutton = false;
  var click2go = false;
  var address = "";
  var pan = "";
  var doubleClickZoom = false;
  var imageDateControl = false;
  var scrollwheel = false;
  var zoom_pos = "";
  var zoom_size = "";
  var zoom_start = 1.1;
  var fullscreen = false;
  //
  
  var fullscreen_width;
  var fullscreen_height;
  var panorama;
  var timer;
  if(typeof(mode)=="undefined") {
  	var mode = "undefined";
  }
  
  function init_gl() {
  	if(mode == "webgl") {
  		var c = document.getElementsByTagName("canvas_streetviewpanorama").item(0);
  		if(c) {
  			c.addEventListener("webglcontextrestored", function(){
  				spinIt();
  			}, false);
  		}
  	}
  }
  
  function init() {
  
  	if(mode=="undefined") {
  		mode = "html4";
  		if(window.WebGLRenderingContext) {
  			var testCanvas = document.createElement("canvas_streetviewpanorama");
  			if(testCanvas) {
  				//mode = "html5";
  				document.getElementsByTagName("body").item(0).appendChild(testCanvas);
  				var webgl_names = new Array();
  				webgl_names.push("webgl");
  				webgl_names.push("experimental-webgl");
  				webgl_names.push("moz-webgl");
  				webgl_names.push("webkit-3d");
  				for(i=0;i<4;i++) {
  					try {
  						var context = testCanvas.getContext(webgl_names[i]);
  						if (context && typeof(context.getParameter) == "function") {
  							mode = "webgl";
  							break;
  						}
  					} catch(e) {
  						
  					}
  				}
  				testCanvas.parentNode.removeChild(testCanvas);
  			}
  		}
  	}
  	
  	var gps = new google.maps.LatLng(latitude,longitude);
  	
  	var address_control = false;
  	var address_control_options = {position:google.maps.ControlPosition.TOP_LEFT};
  	if(address != "") {
  		address_control = true;
  		address_control_options = {position:address};
  	}
  	
  	var pan_control = false;
  	var pan_control_options = {position:google.maps.ControlPosition.TOP_LEFT};
  	if(pan != "") {
  		pan_control = true;
  		pan_control_options = {position:pan};
  	}
  	
  	var zoom_control = false;
  	var zoom_control_options = {position:google.maps.ControlPosition.TOP_LEFT,style:google.maps.ZoomControlStyle.DEFAULT};
  	if(zoom_pos != "") {
  		zoom_control = true;
  		zoom_control_options = {position:zoom_pos, style:zoom_size};
  	}
  	
  	var disableDoubleClickZoom = true;
  	if(doubleClickZoom) {
  		disableDoubleClickZoom = false;
  	}
  	
  	var panoramaOptions = {
  		pano: panoid,
  		pov: {
  			heading: 0,
  			pitch:0,
  			zoom:zoom		},
  		clickToGo: click2go,
  		scrollwheel: scrollwheel,
  		zoomControl: zoom_control,
  		zoomControlOptions: zoom_control_options,
  		panControl:pan_control,
  		panControlOptions:pan_control_options,
  		visible:true,
  		mode:mode,
  		addressControl:address_control,
  		addressControlOptions:address_control_options,
  		linksControl:chevrons,
  		disableDoubleClickZoom:disableDoubleClickZoom,
  		imageDateControl:imageDateControl,
  		scrollwheel:scrollwheel,
  		enableCloseButton:closebutton,
  		position: gps
  	};
  	
  	var canvas = document.getElementById("canvas_streetviewpanorama");
  	panorama = new google.maps.StreetViewPanorama(canvas, panoramaOptions);
  	google.maps.event.addListener(panorama, 'closeclick', function() {
  		show_map();
  	});
  	
  	panorama.setPano(panoid);
  	
  	google.maps.event.addListener(panorama, 'pano_changed', function() {
  		panoid = panorama.getPano();
  	});
  	
  	if(canvas.onmouseover == null) {
  		start_spin();
  		setTimeout("init_gl();",1000);
  	}
  	canvas.onmouseover = stop_spin;
  	canvas.onmouseout = start_spin;	
  }
  
  function show_map() {
  	var canvas = document.getElementById("canvas_streetviewpanorama");
  	canvas.onmouseover = function(){};
  	canvas.onmouseout = function(){};
  	stop_spin();
  	
  	var gps = new google.maps.LatLng(latitude,longitude);
  	var map_options = {
  		center: gps,
  		zoom: 16,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
  	};
  
  	var canvas = document.getElementById("canvas_streetviewpanorama");
  	panorama = new google.maps.Map(canvas,map_options);
  	
  	var mopts = {
  		map: panorama,
  		position: gps,
  		visible: true
  	};
  	var marker = new google.maps.Marker(mopts);
  	
  	google.maps.event.addListener(marker, 'click', function() {
  		init();
  	});
  	
  }
  
  function spinIt() {
  	try {
  		var pov = panorama.getPov();
  		pov.heading += increment;
  		while(pov.heading > 360.0) {
  			pov.heading -= 360.0;
  		}
  		while(pov.heading < 0.0) {
  			pov.heading += 360.0;
  		}
  
  		panorama.setPov(pov);
  	} catch(e) {}
  }
  
  function stop_spin() {
  	clearTimeout(timer);
  }
  
  function start_spin() {
  	clearTimeout(timer);
  	timer = setInterval("spinIt()",interval);
  }
  
  function goto_fullscreen() {
  	var canvas = document.getElementById("canvas_streetviewpanorama");
  	if(typeof(document.webkitCancelFullScreen) != "undefined") {
  		canvas.webkitRequestFullScreen();
  		fullscreen_width = canvas.clientWidth;
  		fullscreen_height = canvas.clientHeight;
  		canvas.style.width="100%";
  		canvas.style.height="100%";
  		document.addEventListener("webkitfullscreenchange", function () {
  			if(!document.webkitIsFullScreen) {
  				var c = document.getElementById("canvas_streetviewpanorama");
  				c.style.width = fullscreen_width + "px";
  				c.style.height = fullscreen_height + "px";
  			}
  		}, false);
  	} else if(typeof(document.mozCancelFullScreen) != "undefined") {
  		console.log("moz");
  		canvas.mozRequestFullScreen();
  		fullscreen_width = canvas.clientWidth;
  		fullscreen_height = canvas.clientHeight;
  		canvas.style.width="100%";
  		canvas.style.height="100%";
  		document.addEventListener("mozfullscreenchange", function () {
  			if(document.mozFullScreenElement == null) {
  				var c = document.getElementById("canvas_streetviewpanorama");
  				c.style.width = fullscreen_width + "px";
  				c.style.height = fullscreen_height + "px";
  				google.maps.event.trigger(panorama, 'resize')
  			}
  		}, false);
  	}
  }
  
  if(typeof(script)=="undefined") {
  	var script = document.createElement("script");
  	script.type = "text/javascript";
  	script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=init";
  	
  	if(typeof(maps_api_key)!="undefined" && maps_api_key!="") {
  		script.src += "&key="+maps_api_key;
  	}
  	document.body.appendChild(script);
  }
</script>