class Entity {

	// optional, defaults attributes are now set using Entity.setDefaultProps
	static defaults = {
		type : 'Entity',
		isAlive : true,
	}

	constructor(entityData, core) {
		this.core = core;
		this.props = entityData;
		this.setDefaultProps(entityData);
	}

	/* If there is an attribute in defaults that isn't already in props
	 * then copy it over to props. */
	static applyDefaultProps(defaults, props) {
		for (let attribute in defaults) {
			if (!(attribute in props)) {
				props[attribute] = defaults[attribute];
			}
		}
	}

	/* When you want to introduce new default props for your class that
	 * extends Entity, then make you can add the defaults to the props
	 * object here. Make sure to call super.setDefaultProps */
	setDefaultProps(props) {
		Entity.applyDefaultProps(Entity.defaults, props);
	}

	isAlive() {
		return this.props.isAlive;
	}

	/* Most of the setup for your code should go here instead of the
	 * constructor. This function should be called by the graphics core
	 * and after calling it, your sprite should be visiable on the
	 * screen. */
	setup() {
	}

	/* This function is called once each graphics loop. When this is
	 * called, assume that backend has made some changes to this.props.
	 * Update the sprites accordingly. */
	draw() {
	}

	/* This function is called when the entity will be removed from the
	 * entity list. This function is so that you can make some death
	 * animations. */
	death() {
	}

	/* This function is called when the entity will be removed from the
	 * entity list. This function is so that you can get pixi to remove
	 * the sprite. */
	cleanup() {
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
