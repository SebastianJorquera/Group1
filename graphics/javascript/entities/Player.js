class Player extends CommonEntity {
	particleSpeed = 2;
	particleRate = 2;
	velocityHistoryLength = 10;
	avgVelocityMultiplier = 1;
	trailColors = [
		0xffffaa,
		0xf7d9c4,
	];

	velocityHistory = [];
	previousPosition = new Victor(0, 0);
	frames = 0;

	constructor(entityData, core) {
		super(entityData, core, 'spaceship');
	}

	setup() {
		super.setup();

		for (let i = 0; i < this.velocityHistoryLength; i++ ) {
			this.velocityHistory.push(new Victor(0, 0));
		}
		this.previousPosition = new Victor(this.props.x, this.props.y);
	}

	avgVelocity() {
		let sum = new Victor(0, 0);
		for (let i = 0; i < this.velocityHistory.length; i++) {
			sum.add(this.velocityHistory[i]);
		}
		sum.x /= (this.velocityHistory.length);
		sum.y /= (this.velocityHistory.length);
		return sum;
	}

	updateVelocityHistory() {
		let position = new Victor(this.props.x, this.props.y);
		this.velocityHistory.shift();
		this.velocityHistory.push(position.clone().subtract(this.previousPosition));
		this.previousPosition = position;
	}

	draw() {
		super.draw();
		this.particles();
	}

	trailColor() {
		return this.trailColors[Math.floor(Math.random() * this.trailColors.length)];
	}

	particles() {
		this.updateVelocityHistory();
		if (this.frames++ % this.particleRate != 0) { return; }
		let position = new Victor(this.props.x, this.props.y);
		let velocity = this.randomVelocity();
		let multiplier = new Victor(this.avgVelocityMultiplier, this.avgVelocityMultiplier);
		velocity.add(this.avgVelocity().multiply(multiplier));
		velocity.invert();
		let circleProps = {
			color : this.trailColor(),
			lifecycle : 30,
			radius : 2 * this.props.scale,
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
