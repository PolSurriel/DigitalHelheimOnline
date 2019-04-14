window.lastId = 0;


class RealObject {
    x;
    y;
    id;    

    constructor (x,y){
        this.x = x;
        this.y = y;
        //UMI.realObjects.push(this);
        //UMI.LogicObjects.push(this);
        this.id = lastId++;
    }

    draw(){

        drawingContext.shadowBlur = 0;
        ellipse(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)) ,UMI.toPixel(30), UMI.toPixel(30));
        fill(255);
        text("id: "+this.id, UMI.toPixel( Camera.translationX(this.x)), UMI.toPixel(Camera.translationY(this.y-30)));  
              
    }

    update(){
        
    }

    destroy(){
        
        //UMI.realObjects.splice(UMI.realObjects.indexOf(this), 1);
        //UMI.LogicObjects.splice(UMI.LogicObjects.indexOf(this), 1);
        //delete this;
    }

}