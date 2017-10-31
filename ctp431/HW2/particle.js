
var Particle = function(position){
	this.position = position;
	this.acc = createVector(0, random(0, 10));
	this.velo = createVector(0, random(0, 10));

	this.color = [random(0, 255), random(0, 255), random(0, 255)];
	this.scale = random(0.1, 0.9);
	
	this.lifespan = 255;
}

Particle.prototype.update = function(level){
	// this.velo.add(this.acc)
	// this.position.add(this.velo)
	if (this.position.y > WIN_HEIGHT) {
		this.position.y = 50;
	}

	this.diameter = map(level, 0, 1, 0, 100) * this.scale;

}

Particle.prototype.draw = function() {
	fill(this.color);
	ellipse(
		this.position.x, this.position.y,
		this.diamter, this.diamter
	);

}



