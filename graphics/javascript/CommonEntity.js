class CommonEntity extends Entity {
	/* A lot of entities has xy coordinates and should be able to be
	 * scaled in size. This class implements these features so that they
	 * don't have to be reimplemented in those entities.
	 *
	 * This class is also a nice example of how to extend the Entity
	 * class.
	 *
	 * WARNING: When you extend this class or Entity, do NOT add new
	 * arguments to the constructor. If you do then that entity will case
	 * issues if they were ever initialized. This class can do that
	 * with 'spriteTexture' since it is just meant to be extended. */

	static defaults = {
		x: 0,
		y: 0,
		scale: 1,
	}

	constructor(entityData, core, spriteTexture) {
		super(entityData, core);
		this.spriteTexture = spriteTexture;
	}

	setDefaultProps(props) {
		super.setDefaultProps(props);
		Entity.applyDefaultProps(CommonEntity.defaults, props);
	}

	setup() {
		super.setup();
		let sprite = new PIXI.Sprite(
			this.core.loader.resources[this.spriteTexture].texture
		);
		this.sprite = sprite;
		sprite.scale.set(this.props.scale, this.props.scale);
		sprite.x = this.props.x;
		sprite.y = this.props.y;
		this.core.app.stage.addChild(sprite);
	}

	draw() {
		super.draw();
		this.sprite.x = this.props.x;
		this.sprite.y = this.props.y;
	}

	cleanup() {
		super.cleanup();
		this.core.app.stage.removeChild(this.sprite);
	}
}
