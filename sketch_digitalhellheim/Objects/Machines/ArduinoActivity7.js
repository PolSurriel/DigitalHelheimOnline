var m1Dir = new Vector2D (-2,-2).getUnitaryVector();
var m2Dir = new Vector2D (2,-2).getUnitaryVector();
var m3Dir = new Vector2D (0,1).getUnitaryVector();


class ArduinoActivity7 {

    arms_orientation = 0;
    invoked = false;
    invoking = false;
    in_floor = false;

    health = 100;

    size = 200;

    shield_active = false;


    poly_base = [
        [-95,-93],[-100,-85],[-100,85],[-95,93],
        [-50,93],[-43,85],[-43,17],[43,17],[43,85],
        [50,93],[95,93],[100,85],[100,-85],[95,-93],
        [50,-93],[43,-85],[43,-30],[-43,-30],
        [-43,-85],[-48,-93],[-95,-93]
    ];
    base_pos = {x:0,y:0};
    
    poly_arm1 = [
        [-42,47],[-37,43],[-37,-70],
        [-42,-75],[-63,-75],[-67,-70],
        [-67,43], [-63,47],[-42,47]

    ];

    poly_arm2 = [
        [-118, -374],
        [-123, -370],
        [-123, -257],
        [-118, -252],
        [-97 , -252],
        [-93 , -257],
        [-93 , -370],
        [-97 , -374],
        [-118, -374]
    ];

    arm_pos = {x:0,y:0};


    poly_head = [
        [-25,64],[20,64],
        [20,-90],[-25,-90],
        [-25,64]
    ];

    poly_damage_point = [
        [-25,64],[20,64],
        [20,60],[-25,60],
        [-25,64]
    ];

    head_pos = {x:0,y:0};

    invoking_state = {
        img:0,
        blackBar:0,
        redBar:0,
        asset:900,
        mState:0,

    }
    
    x;
    y;
    constructor (x, y){
        this.x = x;
        this.y = y;


        for (let i = 0; i < this.poly_arm2.length; i++) {
            this.poly_arm2[i][0] = (this.poly_arm1[i][0]*-1)-3;
            this.poly_arm2[i][1] = (this.poly_arm1[i][1]*-1)-27;
        }

        /*
        for (let i = 0; i < this.poly.length; i++) {
            var np = new Vector2D(this.poly[i][0],this.poly[i][1]);
            np.rotate(this.orientation);

            this.poly[i][0] = np.x + x;
            this.poly[i][1] = np.y + y;
            
        }*/
    }

    translate_polygons(){
        for (let i = 0; i < this.poly_base.length; i++) {
            this.poly_base[i][0] += x;
            this.poly_base[i][1] += y;
        }
        
        for (let i = 0; i < this.poly_arm1.length; i++) {
            this.poly_arm1[i][0] += x;
            this.poly_arm1[i][1] += y;
        }

        for (let i = 0; i < this.poly_arm2.length; i++) {
            this.poly_arm2[i][0] += x;
            this.poly_arm2[i][1] += y;
        }

        for (let i = 0; i < this.poly_head.length; i++) {
            this.poly_head[i][0] += x;
            this.poly_head[i][1] += y;
        }

    }

    invoke(){

        this.invoking_state.mState += UMI.getSpeed(300);
        var mSpeed = 0;

        if (this.invoking_state.mState < 300){
            mSpeed = this.invoking_state.mState;
        }else{
            mSpeed = 300 - (this.invoking_state.mState-300);
            if (mSpeed < 0) mSpeed = 0;
        }


        motor1.x += m1Dir.x * UMI.getSpeed(mSpeed);
        motor1.y += m1Dir.y * UMI.getSpeed(mSpeed);
        motor2.x += m2Dir.x * UMI.getSpeed(mSpeed);
        motor2.y += m2Dir.y * UMI.getSpeed(mSpeed);
        motor3.x += m3Dir.x * UMI.getSpeed(mSpeed);
        motor3.y += m3Dir.y * UMI.getSpeed(mSpeed);

        motor1.updatePoly(m1Dir.x * UMI.getSpeed(mSpeed), m1Dir.y * UMI.getSpeed(mSpeed));
        motor2.updatePoly(m2Dir.x * UMI.getSpeed(mSpeed), m2Dir.y * UMI.getSpeed(mSpeed));
        motor3.updatePoly(m3Dir.x * UMI.getSpeed(mSpeed), m3Dir.y * UMI.getSpeed(mSpeed));

        if(this.invoking_state.asset > 0){
            this.invoking_state.asset -= UMI.getSpeed(1000);

            
        }else {
            this.invoking_state.asset = 0;
            this.in_floor = true;
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
                    this.shield_active = true;
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

        textAlign(RIGHT);
        fill(255,255,255,this.invoking_state.blackBar);
        noStroke();
        textSize(2*UMI.toPixel(20));
        text('Arduino Activity 7', -innerWidth/3 + UMI.toPixel(320), innerHeight/2 - UMI.toPixel(110));

    }

    update(){

        if(this.invoking){
            this.invoke();
        }else if (this.invoked) {
            if(this.dancing){
                if(this.dance_normal){
                    if (this.dance_direction == 1){
                        this.arm_pos.x += UMI.getSpeed(30);
                        this.arms_orientation += UMI.getSpeed(0.05);

                    }else {
                        this.arm_pos.x -= UMI.getSpeed(30);
                        this.arms_orientation -= UMI.getSpeed(0.05);

                    }

                }
            }

        }
    }

    draw(){

        if(this.invoking){
            this.invoking_draw();

        }else if (this.invoked){
            this.draw_boss();
            if(this.shield_active)this.draw_shield();
            this.draw_health();
            //this.drawCollider();
        }

    }

    draw_shield(){

        var size = this.size*1.8;
        translate(-UMI.toPixel(size)/2, -UMI.toPixel(size)/2);
        image(boss_shield,  UMI.toPixel(Camera.translationX (this.x)), UMI.toPixel(Camera.translationY(this.y)),UMI.toPixel(size), UMI.toPixel(size) );
        translate(UMI.toPixel(size)/2, UMI.toPixel(size)/2);
        
    }

    draw_boss(){

        translate(-UMI.toPixel(this.size)/2, -UMI.toPixel(this.size)/2);
        
        image(boss_base,  UMI.toPixel(Camera.translationX (this.x+this.base_pos.x)), UMI.toPixel(Camera.translationY(this.y+this.base_pos.y)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        image(boss_brazos,  UMI.toPixel(Camera.translationX (this.x+this.arm_pos.x)), UMI.toPixel(Camera.translationY(this.y+this.arm_pos.y)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        image(boss_cabeza,  UMI.toPixel(Camera.translationX (this.x+this.head_pos.x)), UMI.toPixel(Camera.translationY(this.y+this.head_pos.x)),UMI.toPixel(this.size), UMI.toPixel(this.size) );
        translate(UMI.toPixel(this.size)/2, UMI.toPixel(this.size)/2);
        
    }

    draw_health(){
        image(boss_logo, -innerWidth/3,innerHeight/2 - UMI.toPixel(130), UMI.toPixel(110),UMI.toPixel(90));

        stroke(0,0,0, this.invoking_state.blackBar);
        strokeWeight(20);
        line(-innerWidth/3 + UMI.toPixel(100),innerHeight/2- UMI.toPixel(80), innerWidth/3, innerHeight/2 - UMI.toPixel(80) );
        stroke(221, 0, 29, this.invoking_state.blackBar);
        strokeWeight(10);
        line(-innerWidth/3 + UMI.toPixel(100),
             innerHeight/2- UMI.toPixel(80), 
             map(this.health, 0, 100,-innerWidth/3 + UMI.toPixel(100),  innerWidth/3), 
             innerHeight/2 - UMI.toPixel(80) );
        strokeWeight(1);

        textAlign(RIGHT);
        fill(255,255,255,this.invoking_state.blackBar);
        noStroke();
        textSize(2*UMI.toPixel(20));
        text('Arduino Activity 7', -innerWidth/3 + UMI.toPixel(320), innerHeight/2 - UMI.toPixel(110));

    }

    drawCollider(){
        stroke(255);

        noFill();
        
        beginShape();
        for (let i = 0; i < this.poly_base.length; i++) {
            vertex(UMI.toPixel(Camera.translationX(this.poly_base[i][0])),
                   UMI.toPixel(Camera.translationY(this.poly_base[i][1])));   
        }
        endShape();
        

       
       beginShape();
       for (let i = 0; i < this.poly_arm1.length; i++) {
           vertex(UMI.toPixel(Camera.translationX(this.poly_arm1[i][0])),
                  UMI.toPixel(Camera.translationY(this.poly_arm1[i][1])));   
       }
       endShape();
       
       
       
       beginShape();
       for (let i = 0; i < this.poly_arm2.length; i++) {
           vertex(UMI.toPixel(Camera.translationX(this.poly_arm2[i][0])),
                  UMI.toPixel(Camera.translationY(this.poly_arm2[i][1])));   
       }
       endShape();
       

        
        beginShape();
        for (let i = 0; i < this.poly_head.length; i++) {
            vertex(UMI.toPixel(Camera.translationX(this.poly_head[i][0])),
                   UMI.toPixel(Camera.translationY(this.poly_head[i][1])));   
        }
        endShape();
    }


    
}