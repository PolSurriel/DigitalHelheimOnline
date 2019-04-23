class LittleLightning {

    point1;
    point2;
    
    len_points = 20;
    midPoints;

    opacity = 255;

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


    update (){

        this.opacity -= UMI.getSpeed(300);
        if (this.opacity <= 0) littleLightnings.destroy( this.index_in_main_array );

    }

    draw() {

        drawingContext.shadowBlur = 0;
        //drawingContext.shadowColor = "#5193ff";

        
        stroke(244, 170, 66, this.opacity);
        strokeWeight(2);

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


        /* DEV INFO
        fill(255);
        ellipse(
            UMI.toPixel(Camera.translationX(this.point1.x)),
            UMI.toPixel(Camera.translationY(this.point1.y)),
            2,
            2,
            
        );

        ellipse(
            UMI.toPixel(Camera.translationX(this.point2.x)),
            UMI.toPixel(Camera.translationY(this.point2.y)),
            2,
            2,
            
        );

        */

    }

}