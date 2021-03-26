class TestGraphicsCore extends GraphicsCore {
	initializeLoader(loader, callback) {
		// fetch all the sprites
		loader.add('sprite', '/public/images/sprite.jpg');
		loader.load(callback);
	}
	entityClassMap = {
		'TestEntity': TestEntity,
	}
}

class TestEntity extends Entity {
	props = { // default attributes go here
		type : 'TestEntity',
		isAlive : true,
		x : 0,
		y : 0,
	}

	setup() { // add sprite to stage, etc.
		let sprite = new PIXI.Sprite(
			this.core.loader.resources['sprite'].texture
		);
		sprite.width = 100;
		sprite.height = 100;
		sprite.x = this.props.x;
		sprite.y = this.props.y;
		this.sprite = sprite;
		this.core.app.stage.addChild(sprite);
	}

	draw() {
		if (this.props.x > 60) {
			this.props.isAlive = false;
		}
		this.props.x += 1;
		this.props.y += 1;
		this.sprite.x = this.props.x;
		this.sprite.y = this.props.y;
	}

	cleanup() {
		this.core.app.stage.removeChild(this.sprite);
	}
}

function gameLoop() {
	graphicsCore.graphicsLoop();
	requestAnimationFrame(gameLoop);
}

function setup() {
	graphicsCore.addEntity({
		type: 'TestEntity'
	});
	requestAnimationFrame(gameLoop);
}

const container = document.body;
const graphicsCore = new TestGraphicsCore(container, setup);
