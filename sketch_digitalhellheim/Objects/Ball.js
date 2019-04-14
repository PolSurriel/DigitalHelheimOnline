class Ball extends RealObject{

    radio;
    forecVector;
    default_force;
    force;
    gravity_force;

    last_x;
    last_y;


    moving = false; 

    constructor(x,y, radio){
        super(x,y);
        this.radio = radio;

        this.default_force = UMI.getSpeed(300);
        this.force = this.default_force;
        this.gravity_force = UMI.getSpeed(2);
    }

    setForce(vector){
        this.forecVector = vector;
        this.forecVector.convertToUnitary();
        this.moving = true;

    }

    update() {

        this.last_x = this.x;
        this.last_y = this.y;

        if(this.moving == true){
            
            this.x += this.forecVector.x * this.force;
            this.y += this.forecVector.y * this.force;
            this.force -= this.gravity_force;
            
            if(this.force <= 0){
                this.force = this.default_force;
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