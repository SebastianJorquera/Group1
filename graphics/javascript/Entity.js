class Entity {
	static defaults = { // default attributes go here
		type : 'Entity',
		isAlive : true,
	}

	constructor(entityData, core) {
		this.core = core;
		this.props = entityData;
		this.setup();
	}

	static applyDefaultProps(defaults, props) {
		for (let attribute in defaults) {
			if (!(attribute in props)) {
				props[attribute] = default[attribute];
			}
		}
	}

	setDefaultProps(props) {
		Entity.applyDefaultProps(Entity.defaults, props);
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
