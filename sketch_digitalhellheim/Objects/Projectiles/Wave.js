class Wave extends RealObject {

    direction;

    speed;

    x_initial;
    y_initial;

    distanceVector;

    x1;
    y1;
    x2;
    y2;

    dist;

    constructor(x, y,direction){
        super(x, y);
        this.x_initial = x;
        this.y_initial = y;
        this.direction = direction;

        this.speed = UMI.getSpeed(230);
        
        //UMI.realObjects.push(this);
        //UMI.LogicObjects.push(this);

        this.distanceVector = new Vector2D(0,0);

    }

    update(){

        this.distanceVector.x = this.x - this.x_initial;
        this.distanceVector.y = this.y - this.y_initial;

        if( new Vector2D(pj.x-this.x,pj.y-this.y).getMagnitude() > distance_to_destroy ){
            waves.destroy( this.index_in_main_array );
        }

        this.x += this.direction.x*this.speed;
        this.y += this.direction.y*this.speed;


        
        

        this.x1 = this.x+this.distanceVector.y;
        this.y1 = this.y+(-1)*this.distanceVector.x;
        
        this.x2 = this.x+(-1)*this.distanceVector.y;
        this.y2 = this.y+this.distanceVector.x;
        
            
        


    }

    draw(){
        drawingContext.shadowBlur = 0;
        stroke('red');
        // a cada punto se le sumas los 2 vectores perpendiculares de la distancia que ha reorrido la onda,
        // de esta manera se hallan los 2 puntos para dibujar la onda sabiendo sus extremos
        line(UMI.toPixel(Camera.translationX(this.x1)),UMI.toPixel(Camera.translationY(this.y1)),
                        UMI.toPixel(Camera.translationX(this.x2)),UMI.toPixel(Camera.translationY(this.y2)));
        stroke('white');
    }

    destroy(){
        //UMI.realObjects.splice(UMI.realObjects.indexOf(this), 1);
        //UMI.LogicObjects.splice(UMI.LogicObjects.indexOf(this), 1);
        //waves.splice(waves.indexOf(this), 1);
        //delete this;
    }

}