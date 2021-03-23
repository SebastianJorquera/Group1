if(!PIXI.utils.isWebGLSupported()){
	console.log('WebGL is not supported!');
}

const app = new PIXI.Application({
	width: 950,
	height: 350,
	antialias: true,
});
const loader = PIXI.Loader.shared;

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(window.innerWidth, window.innerHeight);
console.log(`Your window size is ${window.innerWidth}x${window.innerHeight}`);

console.log(`WebGl supported: ${PIXI.utils.isWebGLSupported()}`);
document.body.appendChild(app.view);

/* Keyboard class (just for testing) */
class Keyboard {
	element = null;
	keys = {};

	downListener = event => {
		this.keys[event.key] = true;
	};

	upListener = event => {
		this.keys[event.key] = false;
	}

	constructor(element) {
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

/* show which keys are pressed */
let keyboard = new Keyboard(window);
window.setInterval(() => {
	console.log(keyboard.keys);
}, 1000);


function resize_sprite_width(sprite, width) {
	// keeps aspect ratio
	let divisor = sprite.width / width;
	sprite.width /= divisor;
	sprite.height /= divisor;
}

function resize_wprite_height(sprite, height) {
	// keeps aspect ratio
	let divisor = sprite.height / height;
	sprite.width /= divisor;
	sprite.height /= divisor;
}

let player = {
	sprite : null,
	x : 0,
	y : 0,
};

function setup() {
	let sprite = new PIXI.Sprite(
		loader.resources['sprite'].texture
	);
	resize_sprite_width(100);
	app.stage.addChild(sprite);
	player.sprite = sprite;
	requestAnimationFrame(gameloop);
}
loader.add('sprite', '/public/images/sprite.jpg');
loader.load(setup);

let speed = 10;
let minions = [];


let prevSpaceKeyDown = false;
function gameloop() {
	if (keyboard.isKeyDown('w') || keyboard.isKeyDown('ArrowUp')) {
		player.y -= speed;
	}
	if (keyboard.isKeyDown('s') || keyboard.isKeyDown('ArrowDown')) {
		player.y += speed;
	}
	if (keyboard.isKeyDown('d') || keyboard.isKeyDown('ArrowRight')) {
		player.x += speed;
	}
	if (keyboard.isKeyDown('a') || keyboard.isKeyDown('ArrowLeft')) {
		player.x -= speed;
	}
	let spaceDown = keyboard.isKeyDown(' ');
	if (spaceDown) {
		if (prevSpaceKeyDown == false) {
			spawnThing(player.x, player.y);
		}
	}
	prevSpaceKeyDown = spaceDown;

	player.sprite.x = player.x;
	player.sprite.y = player.y;

	let i = 0;
	while (i < minions.length) {
		let m = minions[i];
		m.x += Math.random() * 10;
		m.y += Math.random() * 10;
		if (m.y > window.innerHeight) {
			minions.splice(i,1);
			app.stage.removeChild(m);
		} else {
			i += 1;
		}
	}
	requestAnimationFrame(gameloop);
}

function spawnThing(x,y) {
	let sprite = new PIXI.Sprite(
		loader.resources['sprite'].texture
	);
	resize_sprite_width(100);
	sprite.x = x;
	sprite.y = y;
	minions.push(sprite);
	app.stage.addChild(sprite);
}
