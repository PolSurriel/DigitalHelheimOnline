class ArduinoActivity7 {


    invoked = false;
    invoking = false;

    health = 100;

    size = 200;

    invoking_state = {
        img:0,
        blackBar:0,
        redBar:0,
        asset:900
    }
    

    constructor (x, y){
        this.x = x;
        this.y = y;


    }

    invoke(){

        if(this.invoking_state.asset > 0){
            this.invoking_state.asset -= UMI.getSpeed(1000);

            
        }else {
            this.invoking_state.asset = 0;
        }

        if(this.invoking_state.img >= 110){
            if( this.invoking_state.blackBar < 255 ) this.invoking_state.blackBar += UMI.getSpeed(120);
            else{
             this.invoking_state.blackBar = 255;

            }    
        
            if(this.invoking_state.blackBar > 0){
                if(this.invoking_state.redBar < 100) this.invoking_state.redBar += UMI.getSpeed(20 + Math.floor(100 - this.invoking_state.redBar)/2);
                else{
                 this.invoking_state.redBar = 100;
                    this.invoking = false;
                    this.invoked = true;
                }  
            }
        }


        if(this.invoking_state.img >= 130){
            this.invoking_state.img = 130 


        

        }else {
            if(this.invoking_state.img < 35){
                this.invoking_state.img += UMI.getSpeed(100-((30-this.invoking_state.img)*2))*2;
            }else if(this.invoking_state.img > 50) {
                this.invoking_state.img += UMI.getSpeed(133-((this.invoking_state.img)))*2;

            }else {
                this.invoking_state.img += UMI.getSpeed(100)*2;

            }
        }
        
    }

    invoking_draw(){

        translate(-UMI.toPixel(this.size + this.invoking_state.asset)/2, -UMI.toPixel(this.size + this.invoking_state.asset)/2);
        image(bossAssets_all,  UMI.toPixel(Camera.translationX (this.x)), UMI.toPixel(Camera.translationY(this.y)),UMI.toPixel(this.size + this.invoking_state.asset), UMI.toPixel(this.size + this.invoking_state.asset) );
        translate(UMI.toPixel(this.size + this.invoking_state.asset)/2, UMI.toPixel(this.size + this.invoking_state.asset)/2);


        image(boss_logo, -innerWidth/3,innerHeight/2 - UMI.toPixel(this.invoking_state.img), UMI.toPixel(110),UMI.toPixel(90));

        stroke(0,0,0, this.invoking_state.blackBar);
        strokeWeight(20);
        line(-innerWidth/3 + UMI.toPixel(100),innerHeight/2- UMI.toPixel(80), innerWidth/3, innerHeight/2 - UMI.toPixel(80) );
        stroke(221, 0, 29, this.invoking_state.blackBar);
        strokeWeight(10);

        line(-innerWidth/3 + UMI.toPixel(100),innerHeight/2- UMI.toPixel(80), innerWidth/3 - UMI.toPixel(innerWidth/3-((innerWidth/3)*this.invoking_state.redBar)/100), innerHeight/2 - UMI.toPixel(80) );
        strokeWeight(1);

        fill(255,255,255,this.invoking_state.blackBar);
        noStroke();
        textSize(UMI.toPixel(20));
        text('Arduino Activity 7', -innerWidth/3 + UMI.toPixel(320), innerHeight/2 - UMI.toPixel(110));

    }

    update(){

        if(this.invoking){
            this.invoke();
        }else if (this.invoked) {

        }
    }

    draw(){

        if(this.invoking){
            this.invoking_draw();

        }else if (this.invoked){
            this.draw_boss();
            this.draw_health();
        }

    }

    draw_boss(){

        translate(-UMI.toPixel(this.size)/2, -UMI.toPixel(this.size)/2);
        image(boss_base,  UMI.toPixel(Camera.translationX (this.x)), UMI.toPixel(Camera.translationY(this.y)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        image(boss_brazos,  UMI.toPixel(Camera.translationX (this.x)), UMI.toPixel(Camera.translationY(this.y)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        image(boss_cabeza,  UMI.toPixel(Camera.translationX (this.x)), UMI.toPixel(Camera.translationY(this.y)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        translate(UMI.toPixel(this.size)/2, UMI.toPixel(this.size)/2);
        
    }

    draw_health(){
        image(boss_logo, -innerWidth/3,innerHeight/2 - UMI.toPixel(130), UMI.toPixel(110),UMI.toPixel(90));

        stroke(0,0,0, this.invoking_state.blackBar);
        strokeWeight(20);
        line(-innerWidth/3 + UMI.toPixel(100),innerHeight/2- UMI.toPixel(80), innerWidth/3, innerHeight/2 - UMI.toPixel(80) );
        stroke(221, 0, 29, this.invoking_state.blackBar);
        strokeWeight(10);
        line(-innerWidth/3 + UMI.toPixel(100),innerHeight/2- UMI.toPixel(80), innerWidth/3, innerHeight/2 - UMI.toPixel(80) );
        strokeWeight(1);

        fill(255,255,255,this.invoking_state.blackBar);
        noStroke();
        textSize(UMI.toPixel(20));
        text('Arduino Activity 7', -innerWidth/3 + UMI.toPixel(320), innerHeight/2 - UMI.toPixel(110));

    }

    
}