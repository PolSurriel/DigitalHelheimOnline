class EnemyLine extends RealObject {

    forceVector;
    directionVector;

    distanceToShoot = 330;
    distanceToRunAway = this.distanceToShoot*0.7;
    maxDistance = 3000;

    rateOfFire = 10;
    timeUntilLastShoot = this.rateOfFire;

    radio = 10;

    normalSpeed = 190;
    actualSpeed;

    
    last_x;
    last_y;


    constructor(x, y) {
        super(x, y);
        this.actualSpeed = this.normalSpeed;
        
        this.forceVector = new Vector2D(x-pj.x, y-pj.y).getUnitaryVector();
        this.directionVector = new Vector2D(x-pj.x, y-pj.y);

        this.rotationCompt = 0;

    }

    shootPlayer(){
        linesShoot.addObj(new LineShoot(this.x, this.y, new Vector2D(pj.x-this.x, pj.y-this.y).getUnitaryVector()));        
    }

    setSpeed(){
        this.speed = UMI.getSpeed(this.actualSpeed);
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

        if (vectorToPlayer.getMagnitude() < this.distanceToRunAway) {
            this.forceVector = vectorToPlayer.getUnitaryVector().getInverseVector();
        } else if (vectorToPlayer.getMagnitude() < this.distanceToShoot){
            if (this.rotationCompt > 0) {
                this.rotationCompt--;
            } else {
                // this.speed = UMI.getSpeed(this.normalSpeed);
                var randomAngle = Math.PI/2 * (Math.random() >= 0.5 ? 1 : -1);
                this.last_rotation = randomAngle;
                this.rotationCompt = Math.floor(Math.random()*180);
            }
            if (Math.random() >= 0.98 && this.timeUntilLastShoot >= this.rateOfFire) {
                this.shootPlayer();
                this.timeUntilLastShoot = 0;
            }

            this.timeUntilLastShoot++;
            this.actualSpeed = this.normalSpeed;
            this.forceVector = vectorToPlayer.getUnitaryVector();
            this.forceVector.rotate(this.last_rotation);
        } else if(vectorToPlayer.getMagnitude() > this.maxDistance) {
            enemiesLines.destroy( this.index_in_main_array );
        } else {
            this.forceVector = vectorToPlayer.getUnitaryVector();
            this.actualSpeed = Math.random() * (this.normalSpeed - 100) + 100;
        }


        this.directionVector.x += this.forceVector.x/this.rotationDelay;
        this.directionVector.y += this.forceVector.y/this.rotationDelay;

        this.directionVector.convertToUnitary();

        this.moveFront();

    }

    update() {
        this.setSpeed();
        this.last_x = this.x;
        this.last_y = this.y;

        if( new Vector2D(pj.x-this.x,pj.y-this.y).getMagnitude() > distance_to_destroy ){
            enemiesLines.destroy(  this.index_in_main_array );
        }
        this.move();
    }

    draw() {

        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = "black";
        fill('gray');
        stroke('black');
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
        enemiesLines.splice(UMI.LogicObjects.indexOf(this), 1);
        delete this;
    }
}
