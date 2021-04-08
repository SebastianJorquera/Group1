class Entity {
	props = { // default attributes go here
		type : 'Entity',
		isAlive : true,
	}

	constructor(entityData, core) {
		this.core = core;
		for (let attribute in this.props) {
			if (!(attribute in entityData)) {
				entityData[attribute] = this.props[attribute];
			}
		}
		this.props = entityData;
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
	isAlive = true;

	constructor(core) {
		super({}, core);
	}

	draw() {
		this.update();
		super.draw()
	}

	update() { // game logic goes here
	}

	isAlive() {
		return this.isAlive;
	}
}
