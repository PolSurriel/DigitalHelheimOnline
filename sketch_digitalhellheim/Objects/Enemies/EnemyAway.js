class EnemyAway extends RealObject {

    forceVector;
    directionVector;

    distanceToRunAway = 100;
    maxDistance = 1000;

    static radio = 3;
    radio = EnemyAway.radio;

    normalSpeed = 20;
    actualSpeed;
    

    rotationCompt;
    last_rotation;

    constructor(x, y) {
        super(x, y);
        
        this.forceVector = new Vector2D(pj.x-x, pj.y-y).getUnitaryVector();
        this.directionVector = new Vector2D(pj.x-x, pj.y-y);

        this.rotationCompt = 0;

        this.actualSpeed = this.normalSpeed;

    }


    moveFront(){
        this.x += this.directionVector.x*this.speed;
        this.y += this.directionVector.y*this.speed;
    }

    move() {

        var x = this.x;
        var y = this.y;

        var playerX = pj.x;
        var playerY = pj.y;


        var vectorToPlayer = new Vector2D(playerX-x,playerY-y);
        var distanceToPlayer = vectorToPlayer.getMagnitude();

        if(distanceToPlayer < pj.radio){
            enemiesAway.destroy( this.index_in_main_array );
            pj.incrementEnergy(pj.increment_on_grab_away);

        } else if (distanceToPlayer < this.distanceToRunAway){
            this.forceVector = vectorToPlayer.getUnitaryVector();
            this.actualSpeed = 150;
        } else if (distanceToPlayer > this.maxDistance) {
            enemiesAway.destroy( this.index_in_main_array );
        } else {

            var gotten = false;

            if(online){

                for (let e = 0; e < online_players.length; e++) {
                    if(online_players[e] != null){
                        var toPlayer = new Vector2D( online_players[e].x - this.x, online_players[e].y - this.y );
                        var distToPlayer = toPlayer.getMagnitude();
                        if(distToPlayer < online_players[e].radio ){
                            enemiesAway.destroy( this.index_in_main_array );
                            gotten = true;
                        }
                        else if(distToPlayer < this.distanceToRunAway) {
                            this.forceVector = toPlayer.getUnitaryVector();
                            this.actualSpeed = 150;
                            gotten = true;
                        }
                        
    
                    }
                    
                }
            }

            
            if (this.rotationCompt > 0) {
                this.rotationCompt--;
            } else {
                this.actualSpeed = this.normalSpeed;
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

    setSpeed(){
        this.speed = UMI.getSpeed(this.actualSpeed);
        this.rotationDelay = UMI.getDelay(0.05);
    }

    update() {
        this.setSpeed();
        this.move();
    }

    draw() {
        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        //drawingContext.shadowBlur = 10;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "green";
        fill(30,255,30,155);
        stroke('green');
        ellipse(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)) ,UMI.toPixel(this.radio*2), UMI.toPixel(this.radio*2));
    
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
