class Player extends CommonEntity {
	particleSpeed = 1;
	particleRate = 2;
	frames = 0;

	constructor(entityData, core) {
		super(entityData, core, 'spaceship');
	}

	draw() {
		super.draw();
		this.particles();
	}

	particles() {
		if (this.frames++ % this.particleRate != 0) { return; }
		let position = new Victor(this.props.x, this.props.y);
		let velocity = this.randomVelocity();
		let circleProps = {
			color : 0xFFFFFF,
			lifecycle : 30,
			radius : 2,
		};
		let particle = new MovingCircle(this.core, position, velocity, circleProps);
		this.addParticle(particle);
	}

	randomVelocity() {
		let vx = Math.random() * this.particleSpeed;
		let vy = Math.random() * this.particleSpeed;
		if (Math.random() < 0.5) {
			vx *= -1;
		}
		if (Math.random() < 0.5) {
			vy *= -1;
		}
		return new Victor(vx, vy);
	}
}
