class Entity {
	props = { // default attributes go here
		type : 'Entity',
		isAlive : true,
	}

	constructor(entityData, core) {
		this.core = core;
		Object.assign(this.props, entityData);
		this.setup();
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

class Particle extends Entity {
	props = {
		type : 'Particle',
		isAlive : true,
	}

	constructor(core) {
		super({}, core);
	}
}
