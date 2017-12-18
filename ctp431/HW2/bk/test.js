
var mic, osc, soundFile; // mic, osciilator, soundFile object 
var currentSource = 'Broke For Free - As Colorful As Ever' // to display file name

var fft; // fft object
var binCount = 1024; // to get fft bin array
var bins = new Array(binCount); // bins array

var inputMode; // changing between mode
var SR = 22050; // sampling rate 


// preloading some assets.
function preload(){
	soundFile = loadSound('./music/broke.mp3');
}


// initial setup function 
function setup(){
	var cnv = createCanvas(windowWidth, windowHeight);
	noStroke();
	colorMode(HSB);

	makeDragAndDrop(cnv, gotFile);

	// soundFile = loadSound('./music/broke.mp3');
	mic = new p5.AudioIn();
	osc = new p5.Oscillator();
	osc.amp(0.5);

	var smoothing = 0.6;
	fft = new p5.FFT(smoothing, binCount);

	for(var i=0; i<binCount; i++){
		bins[i] = new Bin(i, binCount);
	}

	toggleInput(0);
}

// rendering frame (draw animation)
function draw(){
	background(255);

	var spectrum = fft.analyze();

	if(logView){
		var prevPoint = 0;
		for (var i = 0; i < binCount; i++){
			var previousValue = prevPoint;
			prevPoint = bins[i].drawLog(i, binCount, spectrum[i], previousValue);
		}
	} else {
		for (var i = 0; i < binCount; i++){
			bins[i].drawLin(i, binCount, spectrum[i]);
		}
	}

	if (typeof selectedBin !== 'undefined'){
		labelStuff();
		osc.freq(selectedBin.freq);
	}
}



// Labeling near the mouse cursor

// width : System variable that stores the width of the drawing canvas. 
// 		   This value is set by the first parameter of the createCanvas() function.

function labelStuff(){
	fill(255);
	textSize(18);
	text('~' + selectedBin.freq + 'Hz (bin #' + selectedBin.index+')', mouseX, mouseY);
	text('Energy: ' + selectedBin.value, mouseX, mouseY + 20);

	if (soundFile.isPlaying()){
		text('Current Time: ' + soundFile.currentTime().toFixed(3), width/2, 20);
	}

	text('Current Source: ' + currentSource. width/2, 40);
	textSize(14);
	text('Press T to toggle source', width/2, 60);
	text('Logarithmic view: ' + logView + '(L to toggle)', width/2, 80);
	text('Drag a soundfile here to play it', width/2, 100);

}

// Handling Drag and Drop.
function makeDragAndDrop(canvas, callback){
	var domEl = getElement(canvas.elt.id);
	domEl.drop(callback);
}

function gotFile(file){
	soundFile.dispose();
	soundFile = loadSound(file, function(){
		toggleInput(0);
	});
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	background(255);
}


function keyPressed(){
	if(key == 'T'){
		toggleInput();
		console.log('key pressed "L"');
	}
	if(key == 'L'){
		toggleScale();
		console.log('key pressed "L"');
	}
}



function toggleInput(mode){
	if(typeof(mode) === 'number'){
		inputMode = mode;
	} else {
		inputMode += 1;
		inputMode = inputMode % 6;
	}
	switch (inputMode){
		case 0:
			soundFile.play();
			osc.stop();
			mic.stop();
			fft.setInput(soundFile);
			currentSource = 'soundFile';
			break;
		case 1:
			mic.start();
			osc.stop();
			soundFile.pause();
			fft.setInput(mic);
			currentSource = 'mic';
			break;
		case 2:
			osc.setType('sine');
			osc.start();
			mic.stop();
			soundFile.pause();
			fft.setInput(osc);
			currentSource = 'sine';
			break;
		case 3:
			osc.setType('triangle')
			osc.start();
			mic.stop();
			soundFile.pause();
			fft.setInput(osc);
			currentSource = 'triangle';
			break;
		case 4:
			osc.setType('square')
			osc.start();
			mic.stop();
			soundFile.pause();
			fft.setInput(osc);
			currentSource = 'square';
			break;
		case 3:
			osc.setType('sawtooth')
			osc.start();
			mic.stop();
			soundFile.pause();
			fft.setInput(osc);
			currentSource = 'sawtooth';
			break;
	}
}

var logView = true;

function toggleScale() {
	logView = !logView;
}

// to detect bins that are touched by mouse movement
function mouseMoved() {
	if (soundFile.isLoaded()) {
		for (var i = 0; i < bins.length; i++) {
			if ( (bins[i].x + bins[i].width) <= mouseX && mouseX <= bins[i].x) {
				bins[i].isTouching = true;
			}
			else {
				bins[i].isTouching = false;
			}
		}
	}
}


// Bin class

var Bin = function(index, totalBins) {
	this.index = index;
	this.totalBins = totalBins;
	this.color = color(map(this.index, 0, this.totalBins, 0, 255), 255, 255);

	this.isTouching = false;
	this.x;
	this.width;
	this.value;
}

Bin.prototype.drawLog = function(i, totalBins, value, prev){
	this.x = map(Math.log(i+2), 0, Math.log(totalBins), 0, width - 200);
	var h = map(value, 0, 255, height, 0) - height;
	this.width = prev - this.x;
	this.value = value;
	this.draw(h);
	return this.x;
}

Bin.prototype.drawLin = function(i, totalBins, value){
	this.x = map(i, 0, totalBins, 0, width - 200);
	this.width = - width / totalBins;
	this.value = value;
	var h = map(value, 0, 255, height, 0) - height;
	this.draw(h);
}


var selectedBin;

Bin.prototype.draw = function(h){
	if (this.isTouching){
		selectedBin = bins[this.index];
		this.freq = Math.round(this.index * SR / this.totalBins);
		fill(0);
	} else{
		fill(this.color);
	}
	ellipse(this.x, height/2, this.width, h/2);
}

