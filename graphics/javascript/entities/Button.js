class Button extends Entity {
	static defaults = {
		coords : [0, 0, 200, 100], // topLeftX, topLeftY, botRightX, botRightY
		hover : false,
		pushed : false,
		text : 'button',
		color : 0xcaf0f8,
		hoverColor : 0xecffff,
		pushedColor : 0xf77f00,
		borderColor : 0x48cae4,
		borderWidth : 4,
		textColor : 0x023e8a,
	};

	setDefaultProps(props) {
		super.setDefaultProps(props);
		Entity.applyDefaultProps(Button.defaults, props);
	}

	setup() {
		this.button = new PIXI.Graphics();
		this.button.zIndex = 10;
		this.core.app.stage.addChild(this.button);

		this.text = new PIXI.Text(this.props.text, {
			fontFamily : 'Arial',
			fontSize: 24,
			fill: this.props.textColor,
			align: 'center',
		});
		this.text.anchor.x = 0.5;
		this.text.anchor.y = 0.5;
		this.text.zIndex = 11;
		this.core.app.stage.addChild(this.text);

		this.updateButton();
		this.updateText();
	}

	buttonColor() {
		if (this.props.pushed) {
			return this.props.pushedColor;
		} else if (this.props.hover) {
			return this.props.hoverColor;
		} else {
			return this.props.color;
		}
	}

	draw() {
		super.draw();
		this.updateButton();
		this.updateText();
	}

	updateButton() {
		this.button.clear();
		this.button.lineStyle(this.props.borderWidth, this.props.borderColor);
		this.button.beginFill(this.buttonColor());
		let coords = this.props.coords;
		let width = coords[2] - coords[0] + 1;
		let height = coords[3] - coords[1] + 1;
		this.button.drawRect(0, 0, width, height);
		this.button.endFill();
		this.button.x = coords[0];
		this.button.y = coords[1];
	}

	updateText() {
		let coords = this.props.coords;
		if (this.text.text != this.props.text) {
			this.text.text = this.props.text;
		}
		this.text.x = (coords[0] + coords[2]) / 2;
		this.text.y = (coords[1] + coords[3]) / 2;
	}

	cleanup() {
		super.cleanup();
		this.core.app.stage.removeChild(this.button);
		this.core.app.stage.removeChild(this.text);
	}
}

class FlamingButton extends Button {
	setup() {
		super.setup();
		this.flame = new CircleFlame(this.core,
			new Victor(this.text.x, this.text.y),
			-90,
			{
				maxSpeed : 6,
			}
		);
		this.flame.turnOff();
		this.addParticle(this.flame);
	}

	draw() {
		super.draw();
		if (this.props.hover && (!this.flame.isActivated)) {
			this.flame.turnOn();
		} else if (!this.props.hover && this.flame.isActivated) {
			this.flame.turnOff();
		}
	}

	cleanup() {
		super.cleanup();
		this.core.app.stage.removeChild(this.flame);
	}
}
