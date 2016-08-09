function Shooter3d(_main){
    this.main = _main;
    this.BULLETMOVESPEED = 500;
	this.PROJECTILEDAMAGE = 20;
	this.UNITSIZE = 250;
	this.MOVESPEED = 100;
	this.LOOKSPEED = 0.075;

    this.mouse = { x: 0, y: 0 };
    this.scene = null;
    this.bullets = [];
    this.cam = null;

    this.renderer = null;
    this.clock = null;
    this.projector = null;
    this.ASPECT = $("#shooter3dHolder").width() / $("#shooter3dHolder").height();
    this.bulletMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe:false});
    this.bulletGeo = new THREE.SphereGeometry(2, 6, 6);

    this.init();
    this.animate();
}
Shooter3d.prototype.animate = function(){
	//if(runAnim){
		requestAnimationFrame(this.animate.bind(this));
	//}
	this.render();
    //console.log("animate");
}
Shooter3d.prototype.init = function(){
	var _self = this;
    this.clock = new THREE.Clock(); // Used in render() for controls.update()
    this.projector = new THREE.Projector(); // Used in bullet projection
	this.scene = new THREE.Scene(); // Holds all objects in the canvas
	//this.scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0005); // color, density
	
	// Set up camera
	this.cam = new THREE.PerspectiveCamera(60, this.ASPECT, 1, 10000); // FOV, aspect, near, far
	this.cam.position.y = this.UNITSIZE * .2;
	this.scene.add(this.cam);
	
	// Camera moves with mouse, flies around with WASD/arrow keys
	this.controls = new THREE.FirstPersonControls(this.cam);
	this.controls.movementSpeed = this.MOVESPEED;
	this.controls.lookSpeed = this.LOOKSPEED;
	this.controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	this.controls.noFly = true;

	// World objects
	//this.setupScene();
	
	// Artificial Intelligence
	//setupAI();
	
	// Handle drawing as WebGL (faster than Canvas but less supported)
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize($("#shooter3dHolder").width(), $("#shooter3dHolder").height());
	
	// Add the canvas to the document
	//this.renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
    $("#shooter3dHolder").append(this.renderer.domElement);
	//document.body.appendChild(renderer.domElement);
	
	// Track mouse position so we know where to shoot
	$("#shooter3dHolder").mousemove(function(evt){
        evt.preventDefault();
        _self.mouse.x = (evt.clientX / $("#shooter3dHolder").width()) * 2 - 1;
        _self.mouse.y = - (evt.clientY / $("#shooter3dHolder").height()) * 2 + 1;
    });
	
	// Shoot on click
	$("#shooter3dHolder").click(function(e) {
		//e.preventDefault;
		if (e.which === 1) { // Left click only
            console.log("Bullet");
			_self.addBullet();
		}
	});
}
Shooter3d.prototype.render = function(){
// Update and display
	var delta = this.clock.getDelta(), speed = delta * this.BULLETMOVESPEED;
	var aispeed = delta * this.MOVESPEED;
	this.controls.update(delta); // Move camera
	
	// Update bullets. Walk backwards through the list so we can remove items.
	for (var i = this.bullets.length-1; i >= 0; i--) {
		var b = this.bullets[i], p = b.position, d = b.ray.direction;
		//if (!hit) {
			b.translateX(speed * d.x);
			//bullets[i].translateY(speed * bullets[i].direction.y);
			b.translateZ(speed * d.z);
		//}
	}
	this.renderer.render(this.scene, this.cam); // Repaint
}
Shooter3d.prototype.addBullet = function(obj){
	if (obj === undefined) {
		obj = this.cam;
	}

	var sphere = new THREE.Mesh(this.bulletGeo, this.bulletMaterial);
	sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z);

	if (obj instanceof THREE.Camera) {
		var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
		this.projector.unprojectVector(vector, obj);
		sphere.ray = new THREE.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	else {
		var vector = this.cam.position.clone();
		sphere.ray = new THREE.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	sphere.owner = obj;
	
	this.bullets.push(sphere);
	this.scene.add(sphere);
	
	return sphere;
}
// Set up the objects in the world
Shooter3d.prototype.setupScene = function(){
	
	// Lighting
	var directionalLight1 = new THREE.DirectionalLight( 0xF7EFBE, 0.7 );
	directionalLight1.position.set( 0.5, 1, 0.5 );
	this.scene.add( directionalLight1 );
	var directionalLight2 = new THREE.DirectionalLight( 0xF7EFBE, 0.5 );
	directionalLight2.position.set( -0.5, -1, -0.5 );
	this.scene.add( directionalLight2 );
}


