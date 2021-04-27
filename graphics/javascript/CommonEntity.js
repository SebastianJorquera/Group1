class CommonEntity extends Entity {
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
		applyDefaultProps(CommonEntity.defaults, props);
	}

	setup() {
		super.setup();
		let sprite = new PIXI.Sprite(
			this.core.loader.resources[spriteTexture].texture
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
