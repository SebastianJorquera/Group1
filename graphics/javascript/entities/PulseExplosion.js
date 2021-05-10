class PulseExplosion extends Particle{
    //sets up variables, exploProps contains frameStart (when should the explosion begin), 
    //the explosion color, explosion radius, alpha, and container
    

    constructor(core, position, exploProps){
        super(core);
        this.position = position;
        this.innerRadius = 1;
        this.outerRadius = 2;
		this.radiusDifference = 5;
        this.maxRadius = exploProps.maxRadius ? exploProps.maxRadius : 5;
        this.frameStart = exploProps.frameStart ? exploProps.frameStart : 0;
        this.frameEnd = this.frameStart + this.maxRadius;
        this.currentFrame = 0;
        this.color = exploProps.color ? exploProps.color : 0x00FFFF;
        this.container = exploProps.container ? exploProps.container : this.core.app.stage;

    }
    //creates a explosions beginning
    setup(){
        let explosion = new PIXI.Graphics();
        this.explosion = explosion;
        this.explosion.renderable = false; //double check this works
        this.drawExplo();
        this.locationUpdate();
        this.container.addChild(explosion);
    }

    //continues updating explosion after beginning. Called by loop repeatedly in graphicscore
    update(){
		super.update();
        if(this.currentFrame < this.frameStart){
        }
        else if (this.currentFrame < this.frameEnd){
            this.explosion.renderable = true;
            this.outerRadius++;
			if (this.outerRadius > this.radiusDifference) {
				this.innerRadius++;
			}
        }
        else if (this.currentFrame - this.frameEnd < 5){
			this.innerRadius -= 10;
			this.outerRadius -= 10;
			if (this.innerRadius < 1) {
				this.innerRadius = 1;
			}
			if (this.outerRadius < 2) {
				this.outerRadius = 2;
			}
        }
        else{
            this.alive = false;
        }
        this.currentFrame++;
    }
    draw(){
		super.draw();
		this.drawExplo();
        this.locationUpdate();
    }
    locationUpdate(){
        this.explosion.x = this.position.x;
        this.explosion.y = this.position.y;
    }
    //removes all children involved in circle
    cleanup(){
        super.cleanup();
        this.container.removeChild(this.explosion);
		if (!(this.container === this.core.app.stage)) {
			this.core.app.stage.removeChild(this.container);
		}
    }

    drawExplo(){
        this.explosion.clear();
		this.explosion.beginFill(this.color, this.alpha);
		this.explosion.drawTorus(0, 0, this.innerRadius, this.outerRadius);
		this.explosion.endFill();
		this.explosion.zIndex = -1;
    }
    
}
