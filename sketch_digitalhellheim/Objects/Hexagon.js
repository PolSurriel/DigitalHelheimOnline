class Hexagon extends RealObject {

    poly = new Array();

    opacity = 0;

    speed;

    center = new Vector2D(0,0);

    constructor(x,y, poly){
        super(x,y);

        
        this.poly = poly;
        hexagons.addObj(this);

        this.center.x = poly[0][0] - Math.abs(poly[3][0] - poly[0][0])/2; 
        this.center.y = poly[0][1];
        

    }


    
    update(){
        this.speed = UMI.getSpeed(800);

        if(this.opacity < 255){
            this.opacity += this.speed;
            for (let i = 0; i < this.poly.length; i++) {
                var direction = new Vector2D( this.poly[i][0]-this.center.x , this.poly[i][1]-this.center.y).getUnitaryVector();

                this.poly[i][0] += direction.x * this.speed/50;
                this.poly[i][1] += direction.y * this.speed/50;
                
            }

        }

        
            
    }

    draw() {
        
        
        
        drawingContext.shadowBlur = this.opacity/12.5;
         

        
        drawingContext.shadowColor = "orange";
        

        fill(64, 10, 48, 255);
        stroke(45,0,0,255);
        beginShape();
        this.poly.forEach(point => {
            vertex(UMI.toPixel(Camera.translationX(point[0])),UMI.toPixel(Camera.translationY(point[1])));
        });
        endShape();



    }


    
    destroy(){
        
        UMI.realObjects.splice(UMI.realObjects.indexOf(this), 1);
        UMI.LogicObjects.splice(UMI.LogicObjects.indexOf(this), 1);
        hexagons.splice(hexagons.indexOf(this), 1);
        delete this;
    }



}