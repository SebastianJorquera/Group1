class GraphicsCore {

	/* The entityClassMap is to tell the GraphicsCore which class of entities
	 * to create when backend passes an entityData object with any particular
	 * type. For example, in the entityData object, if type : 'Player' then
	 * the class Player will be created for the entityData object. */
	entityClassMap = {
		'Player' : Player,
		'Enemy' : Enemy,
		'Ally' : AlliedInvader,
		'Bullet' : Bullet,
		'EnemyBullet' : EnemyBullet,
		'Blockade' : Blockade,
		'Background' : Background,
		'Button' : Button,
		'FlamingButton' : FlamingButton,
	};

	sound = {
		'blaster' : new Audio('/public/audio/blaster.mp3'),
		'enemyBlaster' : new Audio('/public/audio_final/mixkit-game-whip-shot-1512.mp3'),
		'explosion' : new Audio('/public/audio_final/Lose_explode.mp3'),
		'enemyExplosion' : new Audio('/public/audio_final/enemyexplosion.mp3'),
		'gameOver' : new Audio('/public/audio_final/mixkit-falling-game-over-1942.mp3'),
	};

	entities = [];

	constructor(viewContainer, callback) {
		// viewContainer is a DOM element that contains the PIXI app view
		this.app = new PIXI.Application({
			resizeTo : viewContainer,
			antialias : true,
		});
		this.app.stage.sortableChildren = true;
		this.loader = PIXI.Loader.shared;
		console.log(`WebGl supported: ${PIXI.utils.isWebGLSupported()}`);
		document.body.appendChild(this.app.view);
		this.initializeLoader(this.loader);
		this.loader.load(callback);
	}

	playSound(name) {
		if (name in this.sound) {
			this.sound[name].play();
		} else {
			console.log(`missing sound effect: ${name}`);
		}
	}

	initializeLoader(loader) {
		// fetch all the sprites
		loader
			.add('bullet', '/public/images_original/bullet_pixel.png')
			.add('spaceship', '/public/images_original/spaceship_pixel.png')
			.add('invader', '/public/images_original/UFO_pixel.png');
	}

	addEntity(entityData) {
		if (entityData.type in this.entityClassMap) {
			let entityClass = this.entityClassMap[entityData.type]
			let entity = new entityClass(entityData, this);
			entity.setup();
			this.entities.push(entity);
		}
		else {
			console.error(`Error: entity of type ${entityData.type} does not exist`);
		}
	}

	graphicsLoop() {
		let aliveEntities = [];
		for (let entity of this.entities) {
			if (entity.isAlive()) {
				entity.loop();
				aliveEntities.push(entity);
			} else {
				entity.death();
				entity.cleanup();
			}
		}
		this.entities = aliveEntities;
	}
}
