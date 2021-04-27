class TestGraphicsCore extends GraphicsCore {
	initializeLoader(loader) {
		// fetch all the sprites
		super.initializeLoader(loader);
		loader.add('sprite', '/public/images/sprite.jpg');
	}
	entityClassMap = {
		'TestEntity': TestEntity,
	}
}

class TestEntity extends Player {
	draw() {
		super.draw();
		// gameloop code, don't put this type of code in draw
		// I'm just doing this for a quick demo
		this.props.x += 1;
		this.props.y += 1;
	}
}

function gameLoop() {
	graphicsCore.graphicsLoop();
	requestAnimationFrame(gameLoop);
}

function setup() {
	let entityData = {
		type: 'TestEntity',
		isAlive: true,
	};
	graphicsCore.addEntity(entityData);
	requestAnimationFrame(gameLoop);
}

const container = document.body;
const graphicsCore = new TestGraphicsCore(container, setup);
