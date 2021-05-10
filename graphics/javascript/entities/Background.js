class Background extends Entity {
	/* The entity that draws the background */

	static defaults = {
		starLifeCycle : 240,
		spawnRate : 2,
		spawnCount : 1,
		starRadius : 5,
		layers : 5,
		shootingStarChance : 5, // percent
		shootingStarSpeed : 5,
	}

	setDefaultProps(props) {
		super.setDefaultProps(props);
		Entity.applyDefaultProps(Background.defaults, props);
	}

	zIndex = Number.NEGATIVE_INFINITY;
	fadingCircleTextureList = [];
	frameCount = 0;

	setup() {
		for (let i = 0; i < this.props.layers; i++) {
			this.fadingCircleTextureList.push({});
		}
		const size = (this.props.starLifeCycle + 2)
			* (this.props.spawnCount / this.props.spawnRate)
			* this.props.layers;
		this.container = new PIXI.ParticleContainer(size);
		this.container.zIndex = this.zIndex;
		this.core.app.stage.addChild(this.container);
	}

	cleanup() {
		this.core.app.stage.removeChild(this.container);
	}

	draw() {
		super.draw();
		this.spawnStars();
	}

	spawnStars() {
		if (this.frameCount++ % this.props.spawnRate != 0) { return; }
		for (let i = 0; i < this.props.spawnCount; i++) {
			let width = this.core.app.view.width;
			let height = this.core.app.view.height;
			const topLeft = new Victor(0, 0);
			const bottomRight = new Victor(width, height);
			const position = new Victor(0, 0).randomize(topLeft, bottomRight);
			this.addStar(position, 0xFFFFFF, this.props.starRadius);
		}
	}

	addStar(position, color, radius) {
		let velocity = new Victor(0, 0);
		if (Math.random() * 100 < this.props.shootingStarChance) {
			velocity.x = Math.random() * 2 - 1;
			velocity.y = Math.random() * 2 - 1;
			velocity.normalize();
			velocity.multiply(new Victor(this.props.shootingStarSpeed, this.props.shootingStarSpeed));
		}

		let alpha = 1 / this.props.layers;
		let radiusDecrement = radius / (this.props.layers + 1);
		let life = Math.floor(this.props.starLifeCycle * 2 * Utils.gaussianRand(3));
		for (let i = 0; i < this.props.layers; i++) {
			let circle = this.createCircle(position, velocity, color, alpha, radius, i, life);
			radius -= radiusDecrement;
			this.addParticle(circle);
		}
	}

	createCircle(position, velocity, color, alpha, radius, textureIndex, lifecycle) {
		return new FadingCircleP(this.core,
			position.clone(),
			velocity.clone(),
			this.fadingCircleTextureList[textureIndex],
			{
				color: color,
				container: this.container,
				alpha: alpha,
				lifecycle: lifecycle,
				radius: radius,
				targetAlpha: 0,
				targetColor: color,
				fadeIn : true,
			},
		);
	}
}
