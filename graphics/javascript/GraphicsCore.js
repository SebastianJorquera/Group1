class GraphicsCore {

	/* The entityClassMap is to tell the GraphicsCore which class of entities
	 * to create when backend passes an entityData object with any particular
	 * type. For example, in the entityData object, if type : 'Player' then
	 * the class Player will be created for the entityData object. */
	entityClassMap = {
		'Player' : Player,
		'Bullet' : Bullet,
	}

	entities = []

	constructor(viewContainer, callback) {
		// viewContainer is a DOM element that contains the PIXI app view
		this.app = new PIXI.Application({
			resizeTo : viewContainer,
			antialias : true,
		});
		this.loader = PIXI.Loader.shared;
		console.log(`WebGl supported: ${PIXI.utils.isWebGLSupported()}`);
		document.body.appendChild(this.app.view);
		this.initializeLoader(this.loader);
		this.loader.load(callback);
	}

	initializeLoader(loader) {
		// fetch all the sprites
		loader
			.add('bullet', '/public/images_original/bullet.png')
			.add('spaceship', '/public/images_original/spaceship.png');
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

	clearParticles() {
	}

	clearEntities() {
	}

	clearMenuEntities() {
	}
}
