class MovingCircle extends Particle {

	/* position and velocity are of instance Victor
	 * circleProps = {
	 *     color: int,
	 *     radius: int,
	 *     lifecycle: int,
	 *     alpha: int,
	 *     container: PIXI.container,
	 * }
	 * lifecycle is the number of updates before the circle dies.
	 * If lifecycle is negative then it will never automatically die.
	 * If container is undefined then the PIXI stage will be used. */
	constructor(core, position, velocity, circleProps) {
		super(core);
		this.position = position;
		this.velocity = velocity;
		this.color = circleProps.color ? circleProps.color : 0xFFFFFF;
		this.radius = circleProps.radius ? circleProps.radius : 5;
		this.lifecycle = circleProps.lifecycle ? circleProps.lifecycle : -1;
		this.alpha = circleProps.alpha ? circleProps.alpha : 1;
		this.container = circleProps.container ? circleProps.container : this.core.app.stage;
	}

	syncCirclePosition() {
		this.circle.x = this.position.x;
		this.circle.y = this.position.y;
	}

	updateLifecycle() {
		if (this.lifecycle < 0) { return; }
		this.lifecycle--;
		if (this.lifecycle < 0) {
			this.alive = false;
		}
	}

	setup() {
		let circle = new PIXI.Graphics();
		this.circle = circle;
		this.drawCircle();
		this.syncCirclePosition();
		this.container.addChild(circle);
	}

	drawCircle() {
		this.circle.clear();
		this.circle.beginFill(this.color, this.alpha);
		this.circle.drawCircle(0, 0, this.radius);
		this.circle.endFill();
		this.circle.zIndex = -1;
	}

	draw() {
		this.syncCirclePosition();
	}

	update() {
		this.updateLifecycle();
		this.position.add(this.velocity);
	}

	cleanup() {
		super.cleanup();
		this.container.removeChild(this.circle);
	}
}

/* circleProps = {
 *     targetAlpha : float, // [0,1]
 *     targetColor : int
 * }
 * As well as all the circleProps from MovingCircle.
 *
 * targetAlpha and targetColor are the values to fade into.
 * Fade time is based on lifecycle */
class FadingCircle extends MovingCircle {
	constructor(core, position, velocity, circleProps) {
		super(core, position, velocity, circleProps);
		this.targetAlpha = circleProps.targetAlpha ? circleProps.targetAlpha : 0;
		this.targetColor = circleProps.targetColor ? circleProps.targetColor : this.color;
		this.fadeIn = circleProps.fadeIn ? circleProps.fadeIn : false;
		this.originalAlpha = this.alpha;
		this.originalColor = this.color;
		this.lifespan = this.lifecycle;
	}

	setup() {
		super.setup();
	}

	draw() {
		super.draw();
		this.drawCircle();
	}

	calcFadeRatio() {
		let fadeRatio;
		if (this.fadeIn) {
			if (this.lifecycle > this.lifespan / 2) {
				let diff = this.lifespan - this.lifecycle;
				fadeRatio = diff / (this.lifespan / 2);
				fadeRatio = 1 - fadeRatio;
			} else {
				let diff = this.lifespan / 2 - this.lifecycle;
				fadeRatio = diff / (this.lifespan / 2);
			}
		} else {
			let diff = this.lifespan - this.lifecycle;
			fadeRatio = diff / this.lifespan;
		}
		return fadeRatio;
	}

	update() {
		super.update();
		let fadeRatio = this.calcFadeRatio();
		let oColorRGB = Utils.hexToRgb(this.originalColor);
		let tColorRGB = Utils.hexToRgb(this.targetColor);
		let newColorRGB = [];
		for (let i = 0; i < oColorRGB.length; i++) {
			newColorRGB.push(Utils.lerp(oColorRGB[i], tColorRGB[i], fadeRatio));
		}
		this.color = Utils.rgbToHex(newColorRGB);
		this.alpha = Utils.lerp(this.originalAlpha, this.targetAlpha, fadeRatio);
	}
}

/* FadingCircle that works with PIXI.ParticleContainer.
 * One difference is that it uses sprites instead of graphics.
 *
 * textureStore is just an object to cache the texture in so multiple FadingCircles
 * can use the same textureStore */
class FadingCircleP extends FadingCircle {
	constructor(core, position, velocity, textureStore, circleProps) {
		super(core, position, velocity, circleProps)
		this.textureStore = textureStore;
	}
	setup() {
		if (this.textureStore.circleTexture === undefined) {
			let circle = new PIXI.Graphics();
			this.circle = circle;
			this.drawCircle();
			this.textureStore.circleTexture = this.core.app.renderer.generateTexture(this.circle);
		}
		this.circle = new PIXI.Sprite(this.textureStore.circleTexture);
		this.circle.anchor.set(0.5, 0.5);
		this.syncCirclePosition();
		this.container.addChild(this.circle);
	}

	drawCircle() {
		this.circle.beginFill(0xFFFFFF);
		this.circle.drawCircle(0, 0, this.radius);
		this.circle.endFill();
		this.circle.zIndex = -1;
	}

	draw() {
		this.syncCirclePosition();
		this.circle.alpha = this.alpha;
		this.circle.tint = this.color;
	}
}
