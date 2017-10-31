var soundFile;
var fft;

var smoothing = 0.8;
var NUM_SPEC_BINS = 1024;

// preloading some assets.
function preload(){
	soundFile = loadSound('./music/broke.mp3');
}



// var fireworks = new Array(NUM_SPEC_BINS);
var fireworks = [];
var gravity;


function setup(){
	createCanvas(windowWidth, windowHeight, WEBGL);
	stroke(255);
	strokeWeight(4);

	soundFile.play();

	fft = new p5.FFT(smoothing, NUM_SPEC_BINS);
	fft.setInput(soundFile);
	for (i=0; i<NUM_SPEC_BINS; i++){
		fireworks.push(new Fireworks()); 
	}
}

function draw() {

	background(255);
	orbitControl();
	camera(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
	// if (random(1) < 0.5) {
	// 	fireworks.push(new Fireworks());
	// }
	var spectrum = fft.analyze(NUM_SPEC_BINS);
	for (var i = 0; i < fireworks.length; i += 5){
		fireworks[i].update();
		fireworks[i].show(map(spectrum[i], 0, 255, 10, 100));
	}
}

function Fireworks(){
	// this.particle = new Particle(createVector(random(windowWidth), random(windowHeight)), random(100)-50);
	this.particle = new Particle(createVector(random(windowWidth), random(windowHeight)), 0);
}

Fireworks.prototype.update = function(){	
	
	if (this.particle != null){
		gravity = createVector((random(10) - 5)/1000, (random(10) - 5)/1000, (random(10) - 5)/1000);

		this.particle.applyForce(gravity);
		this.particle.update();
		if (this.particle.position.y >= windowHeight/2){
			this.particle.position.y = 0;
		} else if (this.particle.position.x >= windowWidth) {
			this.particle.position.x = 0;
		} else if (this.particle.position.x <= -windowWidth/2) {
			this.particle.position.x = 0;
		} else if (this.particle.position.y <= -windowHeight/2) {
			this.particle.position.y = 0;
		} else if (this.particle.position.z <= -500) {
			this.particle.position.z = 500;
		} else if (this.particle.position.z >= 500) {
			this.particle.position.z = -500;
		}
	}
}

Fireworks.prototype.show = function(mag){
	if (this.particle != null){
		this.particle.show(mag)
	}
}

function Particle(position) {

	this.position = position;
	this.velo = createVector(0, 0, 0);
	this.acc = createVector(0, 0, 0);
	this.rotate_dir = (random(1)- 0.5);
}

Particle.prototype.update = function(){
	this.velo.add(this.acc);
	this.position.add(this.velo);
	this.acc.mult(0);

}

Particle.prototype.applyForce = function(force){
	this.acc.add(force);
}

Particle.prototype.show = function(mag){
	// point(this.position.x, this.position.y);
	push();
	translate(this.position.x - windowWidth/2, this.position.y - windowHeight/2, this.position.z);
	rotateX(frameCount * 0.01 * this.rotate_dir);
  	rotateY(frameCount * 0.01 * this.rotate_dir);
	box(mag);
	// sphere(mag);
	pop();
}

