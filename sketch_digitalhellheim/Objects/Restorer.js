class Restorer{

    wiggle;
    wiggle2;
    size = 70;

    distance_to_infect = 200;

    reference;

    force = new Vector2D(0,0);
    tokillAll = false;

    following = false;
    inComing = false;

    followingSpeed = 400;
    speed = 0;

    contdown = 5;
    contdown_interval;

    constructor (x,y){
        this.x = x;
        this.y = y;

        this.wiggle = new Wiggle( -37,-37,1000);
        this.wiggle2 = new Wiggle(-37,-37,1000);
        this.wiggle3 = new Wiggle(-37,-37,1000);
        this.wiggle4 = new Wiggle(-37,-37,1000);

        this.wiggle.speed = 40;
        this.wiggle2.speed = 20;
        
    }


    update(){
        this.wiggle.update();
        this.wiggle2.update();
        this.wiggle3.update();
        this.wiggle4.update();

        if ( this.following ) {
            if(this.inComing){
                var speed = UMI.getSpeed(this.followingSpeed);
                var vd = new Vector2D( (this.reference.x-this.x),(this.reference.y-this.y) );
                var magnitude = vd.getMagnitude();
                vd.convertToUnitary();

                this.x += vd.x*speed;
                this.y += vd.y*speed;

                if( magnitude <= 3 ){
                    this.inComing = false;
                    if(this.reference == pj)damagenumbers.addObj( new DamageNumber (this.x, this.y,this.contdown+1,false,true) );
                    this.contdown_interval = setInterval(() => {
                        
                        if ( this.contdown == 0 ){
                            this.following = false;
                            this.inComing = false;
                            pj.die();
                            shareDeath();

                            
                            clearInterval(this.contdown_interval);
                        }else{
                            if(this.reference == pj)damagenumbers.addObj( new DamageNumber (this.x, this.y,this.contdown,false,true) );
                            this.contdown --;
                            
                        }
                        
                    }, 1000);
                }

            } else {
                this.x = this.reference.x;
                this.y = this.reference.y;

                this.reference.incrementEnergy(this.reference.energy_increment_infected())
            }

        } else {
            this.x += this.force.x*UMI.getSpeed(this.speed);
            this.y += this.force.y*UMI.getSpeed(this.speed);

            if (this.speed <= 0) this.speed = 0;
            else this.speed -= UMI.getSpeed(100);

            if (this.speed == 0 && this.tokillAll){
                this.tokillAll = false;
                pj.die();
                shareDeath();
            }

        }


    }
    
    draw(){


        image(restorer_asset, UMI.toPixel( Camera.translationX(this.x+this.wiggle.x)) , UMI.toPixel(Camera.translationY(this.y+this.wiggle.y)), UMI.toPixel(this.size),UMI.toPixel(this.size));
        image(restorer_asset, UMI.toPixel( Camera.translationX(this.x+this.wiggle3.x)) , UMI.toPixel(Camera.translationY(this.y+this.wiggle3.y)), UMI.toPixel(this.size),UMI.toPixel(this.size));
        image(restorer_asset, UMI.toPixel( Camera.translationX(this.x+this.wiggle2.x)) , UMI.toPixel(Camera.translationY(this.y+this.wiggle2.y)), UMI.toPixel(this.size),UMI.toPixel(this.size));
        
        if (this.inComing || !this.following)
            image(restorer_mid_asset, UMI.toPixel( Camera.translationX(this.x+this.wiggle4.x)) , UMI.toPixel(Camera.translationY(this.y+this.wiggle4.x)), UMI.toPixel(this.size),UMI.toPixel(this.size));
       
    }

}