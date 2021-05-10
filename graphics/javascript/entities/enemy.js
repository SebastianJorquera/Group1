class Enemy extends CommonEntity{
    deathColors = {

    }
    frames = 0;

    constructor(entityData, core){
        super(entityData, core, 'invader');
    }

    death(){
        super.death();
        //do pulse explosions and change color

		for (let i = 0; i < 5; i++) {
			let exploProps = {
				frameStart: i * 10,
				maxRadius: 50,
				color: 0xffb703,
			}
			let pulseExplosion = new PulseExplosion(this.core, 
				Victor.fromObject(this.props), exploProps);
		   this.addParticle(pulseExplosion);
		}
    }


}
