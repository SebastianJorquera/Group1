class Entity {
	props = { // default attributes go here
		type : 'Entity',
		isAlive : true,
	}

	constructor(entityData) {
		Object.assign(this.props, entityData);
		setup()
	}

	isAlive() {
		return this.props.isAlive;
	}

	setup() { // add sprite to stage, etc.
	}

	draw() { // update sprite
	}

	death() {
	}

	cleanup() { // remove sprite from stage, etc.
	}
}
