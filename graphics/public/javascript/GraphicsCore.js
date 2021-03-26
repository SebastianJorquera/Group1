class GraphicsCore {
	entityClassMap = {
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
		this.initializeLoader(this.loader, callback);
	}

	initializeLoader(loader, callback) {
		// fetch all the sprites
		loader.load(callback);
	}

	addEntity(entityData) {
		if (entityData.type in this.entityClassMap) {
			let entityClass = this.entityClassMap[entityData.type]
			let entity = new entityClass(entityData, this);
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
				entity.draw();
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
