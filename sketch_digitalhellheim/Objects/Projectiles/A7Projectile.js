var projID = 0;

class A7Projectile {

    direction;

    rebounds = 0;

    speed;

    destroyEnemy;

    radio = EnemyAway.radio;

    size = new SuperVector(this.radio*2, this.radio*2, 0);

    closed = false;

    following = true;

    boss_is_shooting = true;
    creator_id;
    obj_id;

    constructor(x, y,direction, reference){
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.obj_id = projID++;
        this.creator_id = token;

        this.reference = reference;

        this.size.scale(1.5,1.5,1);
        this.radio = this.size.x/2;

        setTimeout(() => {
            this.boss_is_shooting = false;
        }, 1000);
        

    }

    update(){
        this.speed = UMI.getSpeed(250);

        this.x += this.direction.x*this.speed;
        this.y += this.direction.y*this.speed;

        var vectorToPlayer = new Vector2D(this.reference.x-this.x,this.reference.y-this.y);
        var dist = vectorToPlayer.getMagnitude();

        if(this.following){
            vectorToPlayer.convertToUnitary();
            this.direction.x += vectorToPlayer.x/30;
            this.direction.y += vectorToPlayer.y/30;
        }

        this.direction.convertToUnitary();

        if(dist < pj.radio*10 ){
            this.closed = true;
            this.following = false;  
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