class EnemyAway extends RealObject {

    forceVector;
    directionVector;

    distanceToRunAway = 100;
    maxDistance = 3000;

    static radio = 3;
    radio = EnemyAway.radio;

    normalSpeed = 20;
    

    rotationCompt;
    last_rotation;

    constructor(x, y) {
        super(x, y);
        this.setSpeed();
        
        this.forceVector = new Vector2D(x-pj.x, y-pj.y).getUnitaryVector();
        this.directionVector = new Vector2D(x-pj.x, y-pj.y);
    

        this.rotationCompt = 0;

    }

    setSpeed(){
        this.speed = UMI.getSpeed(this.normalSpeed);
        this.rotationDelay = UMI.getDelay(0.05);
    }

    moveFront(){

        this.x += this.directionVector.x*this.speed;
        this.y += this.directionVector.y*this.speed;
    }

    move() {

        var x = this.x+window.innerWidth/2;
        var y = this.y+window.innerHeight/2;

        var playerX = pj.x+window.innerWidth/2;
        var playerY = pj.y+window.innerHeight/2;


        var vectorToPlayer = new Vector2D(playerX-x,playerY-y);

        if (vectorToPlayer.getMagnitude() < this.distanceToRunAway){
            this.forceVector = vectorToPlayer.getUnitaryVector().getInverseVector();
            this.speed = UMI.getSpeed(Math.random() * (80 - 40) + 40);
        } else if(vectorToPlayer.getMagnitude() > this.maxDistance) {
            enemiesAway.destroy( this.index_in_main_array );
        } else {
            if (this.rotationCompt > 0) {
                this.rotationCompt--;
            } else {
                this.speed = UMI.getSpeed(this.normalSpeed);
                var randomAngle = Math.random()*(Math.PI/180)*2 - PI/180;
                this.last_rotation = randomAngle;
                this.rotationCompt = Math.floor(Math.random()*180);
            }
            this.forceVector.rotate(this.last_rotation);
        }


        this.directionVector.x += this.forceVector.x/this.rotationDelay;
        this.directionVector.y += this.forceVector.y/this.rotationDelay;

        this.directionVector.convertToUnitary();


        this.moveFront();

    }

    update() {
        
        this.move();
    }

    draw() {
        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = "green";
        fill(30,255,30,155);
        stroke('green');
        ellipse(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)) ,UMI.toPixel(this.radio*2), UMI.toPixel(this.radio*2));
        

        textAlign(RIGHT);
        noStroke();
        textSize(UMI.toPixel(40));
        text('x'+score+'    ',window.innerWidth/2,-window.innerHeight/2.2);
    
    }

    drawVectors(){
        this.drawForce();
        this.drawDirection();
    }

    drawForce(){
        stroke('red');
        line(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),
                        UMI.toPixel(Camera.translationX(this.x+this.forceVector.x*100)),UMI.toPixel(Camera.translationY(this.y+this.forceVector.y*100)));
        stroke('white');
    }
    
    drawDirection(){
        stroke('green');
        line(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),
                        UMI.toPixel(Camera.translationX(this.x+this.directionVector.x*100)),UMI.toPixel(Camera.translationY(this.y+this.directionVector.y*100)));
        stroke('white');
    }

    destroy(){        
        UMI.realObjects.splice(UMI.realObjects.indexOf(this), 1);
        UMI.LogicObjects.splice(UMI.LogicObjects.indexOf(this), 1);
        enemiesAway.splice(UMI.LogicObjects.indexOf(this), 1);
        delete this;
    }
}
