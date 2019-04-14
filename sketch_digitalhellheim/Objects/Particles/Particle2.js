class Particle2 {

    size = 2;
    opacity = 200;

    sizeSpeed;
    opSpeed;

    orientation;
    
    force = new SuperVector(-2,-1,0);
    upforce = new Vector2D(0,-1).getUnitaryVector();

    position;

    speedMoving = 60;

    constructor(x, y) {

        this.position = new SuperVector(x, y, 0);
        this.position.w = 1; 

        this.sizeSpeed = 1.5;
        this.opSpeed = 250;

        this.force.toUnitary2D();
        this.force.w = 1;

        this.upforce.y /= 100;
        
    }

    update(){

        var speed = UMI.getSpeed(this.speedMoving);

        this.size -= UMI.getSpeed(this.sizeSpeed);
        this.opacity -= UMI.getSpeed(this.opSpeed);
        
        this.position.translate(this.force.x*speed, this.force.y*speed, 0);
        this.force.translate(this.upforce.x, this.upforce.y);
        this.force.toUnitary2D(); 

        if(this.opacity <= 0)
            title_particles.destroy(this.index_in_main_array);
    }

    draw(){

        var x_on_draw = window.innerWidth/2 + UMI.toPixel(this.position.x);
        var y_on_draw = UMI.toPixel(this.position.y);

        var size_on_draw = UMI.toPixel(this.size);

        var points = [ 
            [x_on_draw-size_on_draw, y_on_draw-size_on_draw],
            [x_on_draw+size_on_draw, y_on_draw-size_on_draw],
            [x_on_draw+size_on_draw, y_on_draw+size_on_draw],
            [x_on_draw-size_on_draw, y_on_draw+size_on_draw]
        ];

        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 10;

        drawingContext.shadowColor = "white";
        
        fill(255,255,255,this.opacity);

        stroke(0,0,0,this.opacity);
    
        beginShape();
        vertex(points[0][0], points[0][1]);
        vertex(points[1][0], points[1][1]);
        vertex(points[2][0], points[2][1]);
        vertex(points[3][0], points[3][1]);
        vertex(points[0][0], points[0][1]);
        endShape();


        fill(255);
        stroke(255);

        drawingContext.shadowBlur = 0;
    }

}