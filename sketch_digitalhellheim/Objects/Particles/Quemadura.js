class Quemadura {

    opacity = 255;

    constructor(x, y, orientation){
        this.x = x;
        this.y = y;
        this.orientation = orientation;
    }

    update(){
        this.opacity -= UMI.getSpeed(150);
        
        if(this.opacity <= 0) quemaduras.destroy(this.index_in_main_array);
    }

    draw(){
        
        var x = UMI.toPixel(Camera.translationX(this.x));
        var y = UMI.toPixel(Camera.translationY(this.y));

        drawingContext.shadowBlur = 0;
        translate(x,y);
        rotate(this.orientation);
        image(textura_quemado, -textura_quemado.width/2, -textura_quemado.height);
        rotate(-this.orientation);
        translate(-x,-y);
        
    }
}