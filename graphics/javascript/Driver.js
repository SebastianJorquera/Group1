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

class TestEntity extends AlliedInvader {
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
		if (keyboard.isKeyDown('f')) {
			this.props.isAlive = false;
			let flame = new Flame(this.core,
				new Victor(this.props.x, this.props.y),
				-90,
				{
					maxSpeed : 6,
					degRange : 180,
				}
			);
			this.addParticle(flame); 
		}
	}
}

let frames = 0;
function gameLoop() {
	if (frames % 20 == 0) {
		button.text = 'Frame count: ' + String(frames);
	}
	frames++;
	graphicsCore.graphicsLoop();
	requestAnimationFrame(gameLoop);
}

let button = {
	type: 'FlamingButton',
	coords: [100, 100, 100 + 300, 100 + 100],
};

function setup() {
	graphicsCore.addEntity({
		type: 'TestEntity',
	});
	graphicsCore.addEntity({
		type: 'Background',
	});
	graphicsCore.addEntity({
		type: 'Blockade',
		coords: [400, 100, 400 + 400, 100 + 50],
	});
	graphicsCore.addEntity(button);
	requestAnimationFrame(gameLoop);
}

document.addEventListener('mousemove', (event) => {
	let x = event.clientX;
	let y = event.clientY;
	let coords = button.coords;
	if (coords[0] <= x && x <= coords[2]
		&& coords[1] <= y && y <= coords[3]) {
		button.hover = true;
	} else {
		button.hover = false;
	}
});

const container = document.body;
const keyboard = new Keyboard(container);
const graphicsCore = new TestGraphicsCore(container, setup);

