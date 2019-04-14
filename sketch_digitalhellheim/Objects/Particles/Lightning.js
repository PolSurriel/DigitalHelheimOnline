class Lightning {

    point1;
    point2;
    
    len_points = 50;
    midPoints;

    max_S = 20;
    constructor(x1, y1, x2, y2){
        this.point1 = new SuperVector(x1, y1, 0);
        this.point2 = new SuperVector(x2, y2, 0);
        this.point1.w = 1;
        this.point2.w = 1;

        this.midPoints = new Array(this.len_points);

        var perpendicular = new Vector2D(this.point2.y - this.point1.y, -(this.point2.x - this.point1.x)).getUnitaryVector();


        var s = 0;
        var direction = 1;
        var changeEach = Math.floor(Math.random() * 30) + 10;

        for (let i = 0; i < this.midPoints.length; i++) {

            this.midPoints[i] = new Vector2D(perpendicular.x*s, perpendicular.y*s);
            s += (Math.random() * 5) *direction;
 
            if(i % changeEach == 1){

                changeEach = Math.floor(Math.random() * 20) + 5;
                direction *= -1;
            }
        }
        



    }


    update (){

        var perpendicular = new Vector2D(this.point2.y - this.point1.y, -(this.point2.x - this.point1.x)).getUnitaryVector();

        var s = 0;
        var direction = 1;
        var changeEach = Math.floor(Math.random() * 30) + 10;

        for (let i = 1; i < this.midPoints.length; i++) {

            
            this.midPoints[i].x = perpendicular.x*s;
            this.midPoints[i].y = perpendicular.y*s;
            s += (Math.random() * 5 ) *direction;
           

            if(i > this.midPoints.length/2){
                if (s > 0){
                    s-= s / (this.midPoints.length - i);
                }else {
                    s-= s / (this.midPoints.length - i);
                }
            }
 
            if(i % changeEach == 1){

                changeEach = Math.floor(Math.random() * 20) + 5;
                direction *= -1;
            }
        }



    }

    draw() {

        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = "blue";
        stroke(188, 214, 255);
        strokeWeight(3);

        var AB = new Vector2D(this.point2.x - this.point1.x, this.point2.y - this.point1.y);
        var magnitude = AB.getMagnitude();
        AB.convertToUnitary();

        var increment = magnitude / this.len_points;


        for (let t = 0; t < 2; t++) {
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

            line(UMI.toPixel(Camera.translationX(x1 + this.midPoints[this.midPoints.length-1].x)),
                UMI.toPixel(Camera.translationY(y1 + this.midPoints[this.midPoints.length-1].y)), 
                UMI.toPixel(Camera.translationX(this.point2.x)),
                UMI.toPixel(Camera.translationY(this.point2.y)),
            );
            
        }
        

        
        drawingContext.shadowBlur = Math.floor(Math.random() * (30 - 10) ) + 10;
        drawingContext.shadowColor = "rgb(153, 191, 255)";
        stroke(153, 191, 255);

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

        line(UMI.toPixel(Camera.translationX(x1 + this.midPoints[this.midPoints.length-1].x)),
             UMI.toPixel(Camera.translationY(y1 + this.midPoints[this.midPoints.length-1].y)), 
             UMI.toPixel(Camera.translationX(this.point2.x)),
             UMI.toPixel(Camera.translationY(this.point2.y)),
        );
        
        strokeWeight(1);
    }

}