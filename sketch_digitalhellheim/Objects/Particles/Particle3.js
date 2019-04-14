class Particle3 {

    size = 4;
    opacity = 200;

    sizeSpeed;
    opSpeed;

    orientation;
    
    force = new SuperVector(-2,-1,0);
    upforce = new Vector2D(0,1).getUnitaryVector();

    position;

    speedMoving = 50;

    constructor(x, y) {

        this.position = new SuperVector(x,y,0);
        this.position.w = 1;
        this.force.w = 1;

        this.sizeSpeed = 1.5;
        this.opSpeed = 250;

        this.force.toUnitary2D();    
        this.upforce.y = this.upforce.y/100;
        
    }

    update(){

        var speed = UMI.getSpeed(this.speedMoving);
        

        this.position.translate(this.force.x*speed, this.force.y*speed, 0);        
        this.force.translate(this.upforce.x/100, this.upforce.y);
        this.force.toUnitary2D();
        
        

        this.size -= UMI.getSpeed(this.sizeSpeed);
        this.opacity -= UMI.getSpeed(this.opSpeed);
        if(this.upforce.x < 10) this.upforce.x++;
        else this.upforce.x = 10;
     

        if(this.opacity <= 0)
            ambiental_particles.destroy(this.index_in_main_array);
    }

    draw(){

        var x_on_draw = UMI.toPixel(this.position.x);
        var y_on_draw = UMI.toPixel(this.position.y);

        var size_on_draw = UMI.toPixel(this.size);

        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 30;

        drawingContext.shadowColor = "gray";
        
        fill(0,0,0,this.opacity);
        stroke(0,0,0,this.opacity);
        
        ellipse(x_on_draw, y_on_draw, size_on_draw, size_on_draw);


        fill(255);
        stroke(255);

        drawingContext.shadowBlur = 0;
    }

}