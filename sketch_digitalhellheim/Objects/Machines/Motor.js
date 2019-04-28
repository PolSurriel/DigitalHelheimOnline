class Motor {

    poly = [[14,15], [3,64],[30,78],[85,78],[112,64], [101,15],[90,10],[90,5],[25,5], [25,10],[14,15]];
    original_poly;
    aiming = 0;

    point1 = [22,15];
    point2 = [92,15];

    radio_points = 40;

    damaging1 = false;
    damaging2 = false;

    damaging1Blocked = false;
    damaging2Blocked = false;

    constructor (x, y, orientation){
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.original_poly = this.poly;

        this.sx = UMI.toPixel(228.0/2);
        this.sy = UMI.toPixel(178.6/2);

        for (let i = 0; i < this.poly.length; i++) {
            var np = new Vector2D(this.poly[i][0],this.poly[i][1]);
            np.rotate(this.orientation);

            this.poly[i][0] = np.x + x;
            this.poly[i][1] = np.y + y;
            
        }

        var np = new Vector2D(this.point1[0],this.point1[1]);
        np.rotate(this.orientation);
        this.point1[0] = np.x +x;
        this.point1[1] = np.y +y;

        np = new Vector2D(this.point2[0],this.point2[1]);
        np.rotate(this.orientation);
        this.point2[0] = np.x +x;
        this.point2[1] = np.y +y;

    }

    updatePoly(x, y){

        this.point1[0] += x;
        this.point1[1] += y;
        this.point2[0] += x;
        this.point2[1] += y;

        for (let i = 0; i < this.poly.length; i++) {
            this.poly[i][0] += x;
            this.poly[i][1] += y;
        }
    }

    update(){

        if(this.damaging1){
            var v = Vector2D.createVectoByAngle(this.orientation-PI/1.5   + Math.random() *2 -1);
            var n1 = (Math.random()*60-30) +30;
            if( 1 == Math.floor(Math.random () * 10) ) littleLightnings.addObj( new LittleLightning( this.point1[0]+v.x*10, this.point1[1]+v.y*10, this.point1[0]+v.x*n1, this.point1[1]+v.y*n1) );

        }
       
        if(this.damaging2){
            var v2 = Vector2D.createVectoByAngle(this.orientation-PI/2.5 +Math.random());
            var n2 = (Math.random()*60-30) +30;
            if( 1 == Math.floor(Math.random () * 10) ) littleLightnings.addObj( new LittleLightning( this.point2[0]+v2.x*10, this.point2[1]+v2.y*10, this.point2[0]+v2.x*n2, this.point2[1]+v2.y*n2) );

        }

    }

    draw(){

        var x = UMI.toPixel(Camera.translationX(this.x));
        var y = UMI.toPixel(Camera.translationY(this.y));

        this.sx = UMI.toPixel(228.0/2);
        this.sy = UMI.toPixel(178.6/2);


        translate(x,y);
        rotate(this.orientation);
        
        image(motor_base,   0, 0  ,this.sx,this.sy);
        image(motor_things, 0, 0,  this.sx,this.sy);
        image(motor_canon,  0, 0 , this.sx,this.sy);
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = 'orange';
        image(motor_light2, 0, 0,  this.sx,this.sy);
        image(motor_light1, 0, 0,  this.sx,this.sy);
        drawingContext.shadowBlur = 0;

        rotate(-this.orientation);
        translate(-x,-y);

        //this.drawCollider();
    }

    drawCollider(){
        stroke(255);

        ellipse(
            UMI.toPixel(Camera.translationX(this.point1[0])),
            UMI.toPixel(Camera.translationY(this.point1[1])),
            UMI.toPixel(this.radio_points/2),UMI.toPixel(this.radio_points/2)
        );
        
        ellipse(
            UMI.toPixel(Camera.translationX(this.point2[0])),
            UMI.toPixel(Camera.translationY(this.point2[1])),
            UMI.toPixel(this.radio_points/2),UMI.toPixel(this.radio_points/2)
        );

        noFill();
        beginShape();
        for (let i = 0; i < this.poly.length; i++) {
            vertex(UMI.toPixel(Camera.translationX(this.poly[i][0])),
                   UMI.toPixel(Camera.translationY(this.poly[i][1])));   
        }
        endShape();
    }

}