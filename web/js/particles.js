function Particle(x,y,x0,y0) {
	this.pos = createVector(x0,y0);
	this.vel = createVector(0,0);
	this.acc = createVector(0,0);
	this.target = createVector(x,y);
	this.size = 5;
	this.color = 'rgba(0,0,0,1)';
	this.maxspeed = 20;
	this.maxforce = 3;

}

Particle.prototype.update = function() {
	this.pos.add(this.vel);
	this.vel.add(this.acc);
	this.acc.mult(0);
}

Particle.prototype.show = function() {
	_context.beginPath();
	_context.arc(this.pos.x, this.pos.y, this.size/2, 0, 2 * Math.PI, false);
	_context.fillStyle = this.color;
	_context.fill();
}

Particle.prototype.behaviors = function() {
	let arrive = this.arrive(this.target);
	let flee = this.flee(_mouse);
	let spin = this.spin();

	arrive.mult(1);
	flee.mult(5);

	this.applyForce(arrive);
	this.applyForce(flee);
	this.applyForce(spin);
}

Particle.prototype.applyForce = function(f) {
	this.acc.add(f);
}

Particle.prototype.arrive = function(target) {
	let desired = p5.Vector.sub(target,this.pos);
	let d = desired.mag();
	let speed = this.maxspeed;
	if(d < 100) {
		speed = map(d,0,100,0,this.maxspeed);
	}
	desired.setMag(speed);
	let steering = p5.Vector.sub(desired,this.vel);
	steering.limit(this.maxforce);
	return steering;
}

Particle.prototype.spin = function() {
	let spin = createVector(this.vel.y,-this.vel.x);
	spin.mult(this.acc.mag()*50);
	spin.mult(sin(frameCount));
	return spin;
}

Particle.prototype.flee = function(target) {
	let desired = p5.Vector.sub(target,this.pos);
	let d = desired.mag();
	if(d<50) {
		desired.setMag(this.maxspeed);
		desired.mult(-1);
		let steering = p5.Vector.sub(desired,this.vel);
		steering.limit(this.maxforce);
		//let x = (cos(frameCount)) * 2;
		//let y = (sin(frameCount)) * 2;
		//let loop = createVector(x,y);
		//steering.add(loop);
		return steering;
	} 
	return _nullVec;
}