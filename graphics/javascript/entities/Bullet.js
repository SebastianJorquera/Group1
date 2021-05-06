class Bullet extends CommonEntity {
	particleRate = 1;
	particleSpeed = 2;
	particleColor = 0x73d2de;
	deathColors = [
		0xffba08,
		0x72efdd,
		0xdeaaff,
	];
	deathParticles = 50;
	deathParticleSpeed = 3;

	frames = 0;
	previousPosition = new Victor(0, 0);

	constructor(entityData, core) {
		super(entityData, core, 'bullet');
	}

	draw() {
		super.draw();
		this.changeOrientation();
		this.particles();
	}

	death() {
		super.death();
		let deathColors = this.deathColors;
		let deathColor = deathColors[Math.floor(Math.random() * deathColors.length)];
		for (let i = 0; i < this.deathParticles; i++) {
			let circleProps = {
				color : deathColor,
				lifecycle : 10 * Math.random() * 2,
				radius : 2 * this.props.scale * Math.random() * 2,
			};
			let speed = this.deathParticleSpeed * 2 * Math.random();
			let circle = new MovingCircle( this.core,
				Victor.fromObject(this.props),
				new Victor(speed, 0).rotateDeg(Math.random() * 360),
				circleProps
			);
			this.addParticle(circle);
		}
	}

	changeOrientation() {
		let pos = Victor.fromObject(this.props);
		let velocity = this.previousPosition.clone().subtract(pos);
		velocity.rotateDeg(-90);
		this.sprite.angle = velocity.horizontalAngleDeg();
	}

	setup() {
		super.setup();
		this.previousPosition = new Victor(this.props.x, this.props.y);
	}

	particles() {
		if (this.frames++ % this.particleRate != 0) { return; }
		let position = new Victor(this.props.x, this.props.y);
		this.previousPosition = new Victor(this.props.x, this.props.y);
		let velocity = this.randomVelocity();
		velocity.add(position.clone().subtract(this.previousPosition));
		velocity.invert();
		let circleProps = {
			color : this.particleColor,
			lifecycle : 20,
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

class EnemyBullet extends Bullet {
	particleColor = 0xFFd2de;

	setup() {
		super.setup();
		this.sprite.tint = 0xFF0000;
	}
}
