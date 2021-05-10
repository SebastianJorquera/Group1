class PulseExplosion extends Particle{
    //sets up variables, exploProps contains frameStart (when should the explosion begin), 
    //the explosion color, explosion radius, alpha, and container
    

    constructor(core, position, exploProps){
        super(core);
        this.position = position;
        this.innerRadius = 0;
        this.outerRadius = 1;
        this.maxRadius = exploProps.maxRadius ? exploProps.maxRadius : 5;
        this.frameStart = exploProps.frameStart ? exploProps.frameStart : 0;
        this.frameEnd = this.frameStart + this.maxRadius;
        this.currentFrame = 0;
        this.color = exploProps.color ? exploProps.color : 0x00FFFF;
        this.container = exploProps.container ? exploProps.container : this.core.app.stage;

    }
    //creates a explosions beginning
    setUp(){
        let explosion = new PIXI.Graphics();
        this.explosion = explosion;
        this.explosion.renderable = false; //double check this works
        this.drawExplo();
        this.locationUpdate();
        this.container.addChild(explosion);
    }

    //continues updating explosion after beginning. Called by loop repeatedly in graphicscore
    update(){
        if(currentFrame < frameStart){
            console.log("not yet appeared");
        }
        else if (currentFrame < frameEnd){
            this.explosion.renderable = true;
            this.explosion.outerRadius++;
        }
        else if (currentFrame-frameEnd < 5){
            this.explosion.innerRadius+this.explosion.outerRadius/6;
            console.log("shrinking");
        }
        else{
            this.explosion.isAlive = false;
            console.log("dead");

        }
        currentFrame++;
    }
    draw(){
        this.locationUpdate();
    }
    locationUpdate(){
        this.explosion.x = position.x;
        this.explosion.y = position.y;
    }
    //removes all children involved in circle
    cleanup(){
        super.cleanup();
        this.container.removeChild(explosion);
    }

    drawExplo(){
        this.explosion.clear();
		this.explosion.beginFill(this.color, this.alpha);
		this.explosion.drawTorus(0, 0, innerRadius, outerRadius);
		this.explosion.endFill();
		this.explosion.zIndex = -1;
    }
    
}