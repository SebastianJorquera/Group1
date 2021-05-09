class Blockade extends Entity {
	static defaults = {
		coords : [0, 0, 100, 50],
		color : 0xFFFFFF,
	}

	setDefaultProps(props) {
		super.setDefaultProps(props);
		Entity.applyDefaultProps(Blockade.defaults, props);
	}

	setup() {
		this.graphics = new PIXI.Graphics();
		this.graphics.zIndex = -2;

		this.core.app.stage.addChild(this.graphics);
	}

	draw() {
		super.draw();
		this.graphics.beginFill(this.props.color);
		let coords = this.props.coords;
		let width = coords[2] - coords[0] + 1;
		let height = coords[3] - coords[1] + 1;
		this.graphics.drawRect(0, 0, width, height);
		this.graphics.endFill();
		this.graphics.x = coords[0];
		this.graphics.y = coords[1];
	}

	cleanup() {
		this.core.app.stage.removeChild(this.graphics);
	}
}
