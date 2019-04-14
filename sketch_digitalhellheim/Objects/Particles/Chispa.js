class Chispa {


    force;
     
    position;

    esDuradero;
    aColisionado = false;

    opSpeed;
    opacity;

    movSpeed;

    noGravity = false;

    isLight;
    gravityForce = new Vector2D(0, 1).getUnitaryVector();

     constructor(x,y, direction, isLight, noGravity) {
        this.noGravity = noGravity;
        this.isLight = isLight;

        this.position = new SuperVector(x,y,0);
        this.position.w = 1;

        direction.convertToUnitary();
        
        this.force = new SuperVector(direction.x, direction.y, 0);
        this.force.w = 1;

        if(isLight)
            this.esDuradero =  1 == (Math.floor(Math.random() * (30 - 1) ) + 1);
        else 
            this.esDuradero =  1 == (Math.floor(Math.random() * (15 - 1) ) + 1);

        this.opacity = 255;

        this.opSpeed = 466;
        this.movSpeed = 466;


        if(!this.noGravity){
            this.gravityForce = new Vector2D(Math.random()*2-1, Math.random()*2-1).getUnitaryVector();
        }

        this.gravityForce.x /= 20;
        this.gravityForce.y /= 20;

    }

    update() {

        var current_movSpeed = UMI.getSpeed(this.movSpeed);
        var current_opSpeed = UMI.getSpeed(this.opSpeed);

        this.position.translate(this.force.x*current_movSpeed, this.force.y*current_movSpeed,0);
        this.force.translate(this.gravityForce.x, this.gravityForce.y, 0);
        this.force.toUnitary2D();


        if(this.noGravity || (!this.esDuradero || this.esDuradero && this.aColisionado)){
            this.opacity -= current_opSpeed;
        }

        if(this.esDuradero){
            var _x = UMI.toPixel( Camera.translationX(this.position.x));
            var _y = UMI.toPixel( Camera.translationY(this.position.y));

            if(!this.noGravity){

                if ( _x < 0 ) {
                    this.aColisionado = true;
                    this.force.x *= -1;
                }else if (_x > window.innerWidth) {
                    this.aColisionado = true;
                    this.force.x *= -1;
    
                }else if(_y < 0){
                    this.aColisionado = true;
                    this.force.y *= -1;
    
                }else if(_y > window.innerHeight){
                    this.aColisionado = true;
                    this.force.y *= -1;
    
                }
            }

        }

        if(this.opacity <= 0){
            chispas_menu.destroy( this.index_in_main_array );
        }

    }

    draw() {


        if(this.isLight){
            if(this.isLight) strokeWeight(2);
            drawingContext.shadowBlur = 5;
            drawingContext.shadowColor = "cyan";
            stroke(153, 191, 255, this.opacity);

        }else {
            drawingContext.shadowBlur = 5;
            drawingContext.shadowColor = "orange";
            stroke(244, 229, 66, this.opacity);
                
        }

        if(this.esDuradero) strokeWeight(2);

        line(UMI.toPixel( Camera.translationX(this.position.x) ), 
             UMI.toPixel( Camera.translationY(this.position.y) ), 
             UMI.toPixel( Camera.translationX(this.position.x-(this.force.x*3)) ), 
             UMI.toPixel( Camera.translationY(this.position.y-(this.force.y*3)) ), 
             );

        strokeWeight(1);
        drawingContext.shadowBlur = 0;

        noStroke();
        strokeWeight(1);


    }


}