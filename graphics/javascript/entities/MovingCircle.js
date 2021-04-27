class MovingCircle extends Particle {

	/* position and velocity are of instance Victor
	 * circleProps = { color: int, radius: int, lifecycle: int }
	 * lifecycle is the number of updates before the circle dies.
	 * If lifecycle is negative then it will never automatically die. */
	constructor(core, position, velocity, circleProps) {
		super(core);
		this.position = position;
		this.velocity = velocity;
		this.color = circleProps.color ? circleProps.color : 0xFFFFFF;
		this.radius = circleProps.radius ? circleProps.radius : 5;
		this.lifecycle = circleProps.lifecycle ? circleProps.lifecycle : -1;
	}

	syncCirclePosition() {
		this.circle.x = this.position.x;
		this.circle.y = this.position.y;
	}

	updateLifecycle() {
		if (this.lifecycle > 0) {
			this.lifecycle--;
		} else if (this.lifecycle == 0) {
			this.alive = false;
		}
	}

	setup() {
		let circle = new PIXI.Graphics();
		this.circle = circle;
		circle.beginFill(this.color);
		circle.drawCircle(0, 0, this.radius);
		circle.endFill();

		this.syncCirclePosition();
		this.core.app.stage.addChild(circle);
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
		this.core.app.stage.removeChild(this.circle);
	}
}
