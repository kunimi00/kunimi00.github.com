var soundFile;
var fft;
var amplitude;
var level;
var spectrum;

var smoothing = 0.8;
var NUM_SPEC_BINS = 1024;
var NUM_BALLS = 800;

var particles = [];
var balls = [];
var curr_points = [];
var all_points = [];


var lyrics_string;
var lyrics_string_jpn;
var lyrics_char;
var lyrics_char_jpn;
var gravity;


var still_moving = false;


// var subject_text = 'メルロマンス'
var subject_text = 'melomance'

// preloading some assets.
function preload(){
	soundFile = loadSound('music/broke.mp3');
	lyrics_string = loadStrings('lyrics_kor.txt');
	lyrics_string_jpn = loadStrings('lyrics_jpn.txt');
	
	font_kor = loadFont('NanumGothic.ttf');
	font_jpn = loadFont('GenJyuuGothic-Heavy.ttf');
	font_light = loadFont('GenJyuuGothic-ExtraLight.ttf');
}

function setup(){
	console.log(lyrics_string.length);
	lyrics_char = lyrics_string.join('').replace(/ /g,'');
	lyrics_char_jpn = lyrics_string_jpn.join('').replace(/ /g,'');

	createCanvas(windowWidth, windowHeight);
	// stroke(10);
	noStroke();
	strokeWeight(4);
	
	soundFile.play();

	fft = new p5.FFT(smoothing, NUM_SPEC_BINS);
	fft.setInput(soundFile);

	amplitude = new p5.Amplitude();
	amplitude.setInput(soundFile);

	for (var i=0; i<NUM_SPEC_BINS; i++){
		particles.push(new Particle(createVector(random(windowWidth), random(windowHeight)), lyrics_char_jpn[i%(lyrics_char.length)])); 
	}

	for (var i=0; i<NUM_BALLS; i++){
		var pt = createVector(windowWidth, int(random(windowHeight)));
		all_points.push(pt);
		// var ball = new Ball(windowWidth + 800, int(random(windowHeight)));
		var ball = new Ball(pt.x, pt.y);
		balls.push(ball);
	}

	level = amplitude.getLevel();

	push();
	textSize(250 + map(level, 0, 1, 0, 200));
	curr_points = font_kor.textToPoints(subject_text, 0, windowHeight/2);

	var b_idx = 0;
	for (var i = 0; i<curr_points.length; i += 2){
		all_points[b_idx] = curr_points[i];
		
		var pt = curr_points[i];
		console.log(pt);
		balls[i].target = createVector(pt.x, pt.y);
		// var ball = new Ball(pt.x, pt.y);
		// balls.push(ball);
	}
	pop();

}

function draw() {

	spectrum = fft.analyze(NUM_SPEC_BINS);
	level = amplitude.getLevel();

	background(255);	

	push();
	noStroke();
	textFont(font_light);
	fill(0);
	textSize(22);
	textStyle(BOLD);
	textAlign(RIGHT, BASELINE);
	text("melomance", windowWidth - 50, windowHeight - 80);
	textSize(14);
	textStyle(NORMAL);
  	text("jung choi, fall 2017", windowWidth - 50, windowHeight - 60);
  	text("song visulization", windowWidth - 50, windowHeight - 43);
	pop();

	for (var i = 0; i < balls.length; i++){
		balls[i].position.y += (random(3));
		balls[i].position.x += (random(3));
		balls[i].update();
		balls[i].behaviors();
		balls[i].show(spectrum[i], level);
	}

	if (still_moving == false){
		
		if (spectrum[100] > 150 || spectrum[200] > 200){
			still_moving = true;
			movement_begin = frameCount;
			subject_text = [];
			var starting_idx = int(random(lyrics_char.length - 6));
			for (var i=0; i<5; i++){
				subject_text.push(lyrics_char[starting_idx + i]);
			}
			console.log(subject_text);
			
			push();
			textSize(100 + map(level, 0, 1, 50, 300));
			var changed_points = font_kor.textToPoints(subject_text, 0, windowHeight/2);

			var p_idx = 0;
			for (var i=0; i < changed_points.length; i += 2){
				all_points[p_idx] = changed_points[i];
				p_idx++;
			}
			for (var i=p_idx; i < all_points.length; i++){
				all_points[i] = createVector(windowWidth, int(random(windowHeight)));
			}
			
			// var b_idx = 0;
			console.log(balls.length);
			for (var i = 0; i<(all_points.length); i++){
				var pt = all_points[i];
				balls[i].target = createVector(pt.x, pt.y);
				// console.log(b_idx);
				// console.log(balls[b_idx].target);
				// b_idx++;
			}
			pop();
		}
		
	}

	if (still_moving == true){
		if (frameCount > movement_begin + 60){
			still_moving = false;
		}
	}

	for (var i = 0; i < particles.length; i += 50){
		particles[i].update();
		particles[i].show(map(spectrum[i], 0, 255, 0, 255));		
	}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}



// Ball particles

function Ball(x, y) {
	this.position = createVector(random(windowWidth), random(windowHeight));
	this.target = createVector(x, y);
	this.velo = createVector();
	// this.acc = createVector();
	this.acc = p5.Vector.random2D().mult(6.0);
	this.r = 10;
	this.maxspeed = 24;
	this.maxforce = 1.4;

}

Ball.prototype.update = function(){
	
	this.position.add(this.velo);
	this.velo.add(this.acc);
	// this.target.add(this.acc.mult(10));
	this.acc.mult(0);
}

Ball.prototype.show = function(mag, level){
	stroke(0, 255, 0, 90);
	strokeWeight(Math.pow((this.r * map(mag, 0, 255, 0.4, 3)), map(level, 0, 1, 1, 1.5)));
	// strokeWeight(Math.pow((this.r * map(mag, 0, 255, 0.3, 1)), map(level, 0, 1, 1, 1)));
	point(this.position.x, this.position.y);

}

Ball.prototype.behaviors = function(){
	// var seek = this.seek(this.target);
	// this.applyForce(seek);

	var arrive_f = this.arrive(this.target);
	this.applyForce(arrive_f);

}

Ball.prototype.applyForce = function(f){
	this.acc.add(f);
}

// Ball.prototype.seek = function(target){
// 	var desired = p5.Vector.sub(target, this.position);
// 	desired.setMag(this.maxspeed);
// 	var steer = p5.Vector.sub(desired, this.velo);
// 	steer.limit(this.maxforce);
	
// 	return steer;
// }

Ball.prototype.arrive = function(target){
	var desired = p5.Vector.sub(target, this.position);
	var d = desired.mag();
	var speed = this.maxspeed;

	if (d < 100){
		var speed = map(d, 0, 100, 0, this.maxspeed);
	}
	desired.setMag(speed);
	
	var steer = p5.Vector.sub(desired, this.velo);
	steer.limit(this.maxforce);

	return steer;

}





// Text particles

function Particle(position, character) {

	this.position = position;
	this.velo = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.target = createVector();

	this.character = character;
}

Particle.prototype.update = function(mag){
	// this.acc.add(mag, mag);
	this.velo.add(this.acc.mult(0.1));
	this.position.add(this.velo);
	this.acc.mult(0);

	gravity = createVector((random(10) - 5)/10, (random(10) - 5)/10);
	this.applyForce(gravity);
	
	if (this.position.y >= windowHeight){
		this.position.y = 0;
	} else if (this.position.x >= windowWidth) {
		this.position.x = 0;
	} else if (this.position.x <= 0) {
		this.position.x = windowWidth;
	} else if (this.position.y <= 0) {
		this.position.y = windowHeight;
	}
}

Particle.prototype.applyForce = function(force){
	this.acc.add(force);
}

Particle.prototype.show = function(mag){
	if (mag > 200){
		this.character = lyrics_char_jpn[int(random(lyrics_char_jpn.length))];
	}
	else if (mag < 10){
		this.character = lyrics_char_jpn[int(random(lyrics_char_jpn.length))];
	}
	push();
	fill(255 - mag);
  	textSize(mag);
  	textFont(font_jpn);
  	// console.log(this.character);
  	strokeWeight(0);
	text(this.character, this.position.x, this.position.y);
	
	pop();
}

