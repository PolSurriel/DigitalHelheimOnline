class Particle {

    z;

    size = 2;
    opacity = 200;

    reference_x = 0;
    reference_y = 0;

    sizeSpeed;
    opSpeed;

    orientation;

    draw_mode;

    position;
    reference;

    setSpeed(){
        this.sizeSpeed = UMI.getSpeed(1.5);
        this.opSpeed = UMI.getSpeed(250);
    
    }

    constructor(x, y, z, orientation, draw_mode, color_mode) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.position = new SuperVector(x,y,z);
        this.reference = new SuperVector(0,0,0);
        this.position.w = 1;
        this.reference.w = 1;

        this.draw_mode = draw_mode;
        this.color_mode = color_mode;

        this.orientation = orientation;

        this.setSpeed();

        particles.addObj(this);

       
    }


    update(){
        this.size -= this.sizeSpeed;
        this.opacity -= this.opSpeed;

    }

    draw(){

        var x = this.reference_x+this.position.x;
        var y = this.reference_y+this.position.y;

        // reference to position vector
        var RP = new SuperVector(x-this.reference_x, y-this.reference_y, 0); //direccion referencia to point a ampliar con z
        var m = RP.getMagnitude(); 
        RP.toUnitary2D();
        
        RP.x *= this.z+m;
        RP.y *= this.z+m; 

        this.z /=4;

        var x_on_draw = UMI.toPixel(Camera.translationX(RP.x+this.reference_x));
        var y_on_draw = UMI.toPixel(Camera.translationY(RP.y+this.reference_y));

        var size_on_draw = UMI.toPixel(this.size);

        var points = [ 
            new SuperVector( x_on_draw-size_on_draw-this.z, y_on_draw-size_on_draw-this.z, 0),
            new SuperVector( x_on_draw+size_on_draw+this.z, y_on_draw-size_on_draw-this.z, 0),
            new SuperVector( x_on_draw+size_on_draw+this.z, y_on_draw+size_on_draw+this.z, 0),
            new SuperVector( x_on_draw-size_on_draw-this.z, y_on_draw+size_on_draw+this.z, 0)
        ];
        

        points.forEach(point => {
            var old_x = point.x;
            var old_y = point.y;

            point.rotateZ(this.orientation);
            point.w = 1;
            point.translate(old_x-point.x,old_y-point.y,0); 


        });
        
        drawingContext.shadowBlur = 10;

        if(this.draw_mode == 1) drawingContext.shadowColor = "blue";
        else if (this.draw_mode == 2) drawingContext.shadowColor = "orange";

        if(this.color_mode != 1 && this.draw_mode == 2) fill (230);
        else if (this.color_mode == 1) fill(155,0,0,this.opacity);
        else fill(20,205,105,this.opacity);

        stroke(100,0,0,this.opacity);
    
        beginShape();
        vertex(points[0].x, points[0].y);
        vertex(points[1].x, points[1].y);
        vertex(points[2].x, points[2].y);
        vertex(points[3].x, points[3].y);
        vertex(points[0].x, points[0].y);
        endShape();


        fill(255);
        stroke(255);

        drawingContext.shadowBlur = 0;

    }





}