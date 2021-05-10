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

        let exploProps = {
            frameStart: 120,
            maxRadius: 290,
            color: 0xFFFF00,
        }
        let pulseExplosion = new PulseExplosion(this.core, 
            Victor.fromObject(this.props), exploProps);
       this.addParticle(pulseExplosion);
    }


}