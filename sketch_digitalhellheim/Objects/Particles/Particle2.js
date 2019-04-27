class Particle2 {

    size = new SuperVector( 4,  4, 0);
    opacity = 200;

    sizeSpeed;
    opSpeed;

    orientation;
    
    force = new SuperVector(-2,-1,0);
    upforce = new SuperVector(0,-1,0);

    position;

    speedMoving = 60;

    constructor(x, y) {

        this.position = new SuperVector(x, y, 0);
        this.position.w = 1; 

        this.sizeSpeed = 1.5;
        this.opSpeed = 250;

        this.force.toUnitary2D();
        
        this.upforce.scale(1,this.upforce.y/100,1);
        
    }

    update(){

        var speed = UMI.getSpeed(this.speedMoving);

        var toScaleX = (this.size.x - UMI.getSpeed(this.sizeSpeed))/this.size.x;
        var toScaleY = (this.size.y - UMI.getSpeed(this.sizeSpeed))/this.size.y;
        this.size.scale(toScaleX, toScaleY, 1);
        
        this.opacity -= UMI.getSpeed(this.opSpeed);
        
        this.position.translate(this.force.x*speed, this.force.y*speed, 0);
        this.force.translate(this.upforce.x, this.upforce.y, 0);
        this.force.toUnitary2D(); 

        if(this.opacity <= 0)
            title_particles.destroy(this.index_in_main_array);
    }

    draw(){

        var x_on_draw = window.innerWidth/2 + UMI.toPixel(this.position.x);
        var y_on_draw = UMI.toPixel(this.position.y);
        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 10;

        drawingContext.shadowColor = "white";
        
        fill(255,255,255,this.opacity);

        stroke(0,0,0,this.opacity);

        rect(x_on_draw, y_on_draw, UMI.toPixel(this.size.x), UMI.toPixel(this.size.y));


        fill(255);
        stroke(255);

        drawingContext.shadowBlur = 0;
    }

}