class Keyboard {
    element = null;
    keys = {};

    downListener = event => {
        this.keys[event.key] = true;
    };

    upListener = event => {
        this.keys[event.key] = false;
    }

    constructor(element) { // either the game element or "window"
        this.element = element;
        element.addEventListener('keydown', this.downListener);
        element.addEventListener('keyup', this.upListener);
    }

    detach() {
        this.element.removeEventListener('keydown', this.downListener);
        this.element.removeEventListener('keyup', this.upListener);
    }

    isKeyDown(key) {
        return key in this.keys && this.keys[key];
    }
}

class TestGraphicsCore extends GraphicsCore {
	constructor(viewContainer, callback) {
		super(viewContainer, callback);
		Object.assign(this.entityClassMap, {
			'TestEntity': TestEntity
		});
	}

	initializeLoader(loader) {
		// fetch all the sprites
		super.initializeLoader(loader);
		loader.add('sprite', '/public/images/sprite.jpg');
	}
}

class TestEntity extends Bullet {
	draw() {
		super.draw();
		// gameloop code, don't put this type of code in draw
		// I'm just doing this for a quick demo
		if (keyboard.isKeyDown('w')) {
			this.props.y -= 4;
		}
		if (keyboard.isKeyDown('a')) {
			this.props.x -= 4;
		}
		if (keyboard.isKeyDown('s')) {
			this.props.y += 4;
		}
		if (keyboard.isKeyDown('d')) {
			this.props.x += 4;
		}
		if (keyboard.isKeyDown('k')) {
			this.props.isAlive = false;
		}
	}
}

function gameLoop() {
	graphicsCore.graphicsLoop();
	requestAnimationFrame(gameLoop);
}

function setup() {
	graphicsCore.addEntity({
		type: 'TestEntity',
	});
	graphicsCore.addEntity({
		type: 'TestEntity',
		x: 100,
		y: 100,
	});
	graphicsCore.addEntity({
		type: 'TestEntity',
		x: 200,
		y: 200,
	});
	requestAnimationFrame(gameLoop);
}

const container = document.body;
const keyboard = new Keyboard(container);
const graphicsCore = new TestGraphicsCore(container, setup);
