class Ball extends RealObject{

    radio;
    forceVector;
    default_force = 300;
    force;
    gravity_force;
    actual_force;

    last_x;
    last_y;


    moving = false; 

    constructor(x,y, radio){
        super(x,y);
        this.radio = radio;

        this.actual_force = this.default_force;
    }

    setSpeed(){
        this.force = UMI.getSpeed(this.actual_force);
        this.gravity_force = UMI.getSpeed(120);
    }

    setForce(vector){
        this.forceVector = vector;
        this.forceVector.convertToUnitary();
        this.moving = true;

    }

    update() {
        this.setSpeed();

        this.last_x = this.x;
        this.last_y = this.y;

        if(this.moving){
            
            this.x += this.forceVector.x * this.force;
            this.y += this.forceVector.y * this.force;
            this.actual_force -= this.gravity_force;
            
            if(this.actual_force <= 0){
                this.actual_force = this.default_force;
                this.moving = false;
            }
        }

    }

    draw(){
        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "yellow";
        fill(224, 173, 45,200);
        stroke('yellow');
        ellipse(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)) ,UMI.toPixel(this.radio*2), UMI.toPixel(this.radio*2));
        
    }

}