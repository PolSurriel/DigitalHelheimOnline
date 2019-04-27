class Projectile extends RealObject {

    direction;

    rebounds = 0;

    speed;

    destroyEnemy;

    radio = new SuperVector(EnemyAway.radio, EnemyAway.radio, 0);

    closed = false;

    following = false;

    constructor(x, y,direction, destroyEnemy){
        super(x, y);
        this.direction = direction;

        this.destroyEnemy = destroyEnemy;

        if(destroyEnemy == true){
            this.radio.scale(4,4,1);
        }

        

        //UMI.realObjects.addObj(this);
        //UMI.LogicObjects.addObj(this);

        

    }

    update(){
        this.speed = UMI.getSpeed(250);

        this.x += this.direction.x*this.speed;
        this.y += this.direction.y*this.speed;

        var vectorToPlayer = new Vector2D(pj.x-this.x,pj.y-this.y);
        var dist = vectorToPlayer.getMagnitude();

        if(!this.destroyEnemy && !this.closed && dist < 200){
            this.following = !this.destroyEnemy;
            vectorToPlayer.convertToUnitary();
            this.direction.x += vectorToPlayer.x/30;
            this.direction.y += vectorToPlayer.y/30;

            this.direction.convertToUnitary();

            if(dist < pj.radio*10 ){
                this.closed = true;
                this.following = false;  
            }  

        }
      

    }

    draw(){
        
        noStroke();
        if(this.following)
            fill(255, 99, 247);
        else
            fill('orange');
        
        ellipse(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),this.radio.x*2,this.radio.y*2);
    }

    destroy(){
    }

}