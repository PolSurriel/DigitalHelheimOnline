class Projectile extends RealObject {

    direction;

    rebounds = 0;

    speed;

    destroyEnemy;

    radio = EnemyAway.radio;

    size = new SuperVector(this.radio*2, this.radio*2, 0);

    closed = false;

    following = false;

    constructor(x, y,direction, destroyEnemy){
        super(x, y);
        this.direction = direction;

        this.destroyEnemy = destroyEnemy;

        if(destroyEnemy){
            this.size.scale(2,2,1);
            this.radio = this.size.x/2;
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
        
        ellipse(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),this.size.x,this.size.y);
    }

    destroy(){
    }

}