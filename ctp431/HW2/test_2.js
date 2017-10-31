var soundFile;
var fft;

var smoothing = 0.8;
var NUM_SPEC_BINS = 1024;

var WIN_WIDTH = 600;
var WIN_HEIGHT = 600;

var particles = new Array(NUM_SPEC_BINS);


function preload(){
	soundFile = loadSound('./music/broke.mp3');
}

function setup() {
	WIN_WIDTH = windowWidth;
	WIN_HEIGHT = windowHeight;
	
	var GRAVITY = createVector(0, 0.2);

	// createCanvas(windowWidth, windowHeight, WEBGL);
	c = createCanvas(WIN_WIDTH, WIN_HEIGHT);
	noStroke();

	soundFile.play();

	fft = new p5.FFT(smoothing, NUM_SPEC_BINS);
	fft.setInput(soundFile);

	for (var i=0; i < NUM_SPEC_BINS; i++){
		var x = map(i, 0, NUM_SPEC_BINS, 0, WIN_WIDTH);
		var y = random(0, WIN_HEIGHT);
		var position = createVector(x, y);
		particles[i] = new Particle(position);
	}
}

function draw() {
	background(0, 0, 0, 100);

	var spectrum = fft.analyze(NUM_SPEC_BINS);

	// drawing each particle with spectrum values

	for (var k = 0; k < spectrum.length; k++){
		var magnitude = map(spectrum[k], 0, 255, 0, 1);
		particles[k].update(magnitude);
		console.log(particles[k].position.y);
		particles[k].draw();
	}

}

