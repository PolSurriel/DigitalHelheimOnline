class LittleLightning {

    point1;
    point2;
    
    len_points = 40;
    midPoints;

    constructor(x1, y1, x2, y2){
        this.point1 = new SuperVector(x1, y1, 0);
        this.point2 = new SuperVector(x2, y2, 0);
        this.point1.w = 1;
        this.point2.w = 1;

        this.midPoints = new Array(this.len_points);

        for (let i = 0; i < this.midPoints.length; i++) {
            this.midPoints[i] = new SuperVector((0,0,0));
            this.midPoints[i].w = 0;
        }
        

    }


    update (){



    }

    draw() {

        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = "#5193ff";
        stroke(255);
        strokeWeight(4);

        var AB = new Vector2D(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
        var magnitude = AB.getMagnitude();
        AB.convertToUnitary();

        var increment = magnitude / this.len_points;



        var x1 = this.point1.x;
        var y1 = this.point1.y;
        var x2 = this.point1.x+ AB.x*increment;
        var y2 = this.point1.y+ AB.y*increment;
        for (let i = 0; i < this.midPoints.length-1; i++) {
            line(
                UMI.toPixel(Camera.translationX(x1 + this.midPoints[i].x)),
                UMI.toPixel(Camera.translationY(y1 + this.midPoints[i].y)), 
                UMI.toPixel(Camera.translationX(x2 + this.midPoints[i+1].x)), 
                UMI.toPixel(Camera.translationY(y2 + this.midPoints[i+1].y))
            );    

            x1 += AB.x*increment;
            y1 += AB.y*increment;
            x2 += AB.x*increment;
            y2 += AB.y*increment;

        }

        
        strokeWeight(1);
    }

}