class Player extends RealObject {

    
    pu_speed_caught = false;
    pu_doubleproj_caught = false;
    pu_health_caught = false;
    pu_shield_caught = false;
    pu_random_caught = false; 

    last_x;
    last_y;

    portal_x;
    portal_y;
    portal_opened = false;


    health = 1;

    z = 0;

    radio = 5;

    speed;

    forceVector;
    directionVector;

    rotationDelay;

    jumping = false;
    jumpingState = 0;
    initialJumpingSpeed;
    jumpingSpeed;

    gravityForce;

    particleGenerationSpeed;
    particlePointToGenerate;
    particleState = 0;

    fixedParticles = new Array();

    static mano_abierta; 
    static mano_cerrada;
    
    static mano_abierta_pu; 
    static mano_cerrada_pu;

    hand_closed = true;

    shield_active = false;

    fall = false;

    orientation;
    
    lighting;
    shooting = false;

    shield = [[0,0], [3,5],[5,7], [10, 10], [20, 6], [30, 5],[40, 6], [50, 10], [55, 7], [59, 3], [60, 0],[45, -7],[30, -10],[15, -7],[0,0] ];
    
    static shield_sound;
    static shield_init_sound;
    static shield_feedback_sound;
    
    can_splash = false;

    holding = new Array();
    holding_on_draw;

    static FORCE_TOP          = new Vector2D(0,-1).getUnitaryVector();
    static FORCE_BOTTOM       = new Vector2D(0,1).getUnitaryVector();
    static FORCE_LEFT         = new Vector2D(-1,0).getUnitaryVector();
    static FORCE_RIGHT        = new Vector2D(1,0).getUnitaryVector();
    static FORCE_TOP_LEFT     = new Vector2D(-1,-1).getUnitaryVector();
    static FORCE_TOP_RIGHT    = new Vector2D(1,-1).getUnitaryVector();
    static FORCE_BOTTOM_LEFT  = new Vector2D(-1,1).getUnitaryVector();
    static FORCE_BOTTOM_RIGHT = new Vector2D(1,1).getUnitaryVector();


    static jump_splash_sound;
    static jump_init_sound;


    shield_orientation;

    mouse_vector;

    setSpeed(){
        this.speed = UMI.getSpeed(100);
        this.rotationDelay = UMI.getDelay(0.05);
        this.initialJumpingSpeed = UMI.getSpeed(800);
        this.jumpingSpeed = this.initialJumpingSpeed;

        this.gravityForce = this.initialJumpingSpeed/23;

        this.particleGenerationSpeed = UMI.getSpeed(20);
        this.particlePointToGenerate = UMI.getSpeed(100);
    }

    constructor (x,y){
        super(x, y);
        this.forceVector = new Vector2D(Player.FORCE_TOP.x, Player.FORCE_TOP.y);
        this.directionVector = new Vector2D(this.forceVector.x,this.forceVector.y);

        this.setSpeed();

        this.__proto__ = "Player";

        for (let i = 0; i < this.shield.length; i++) {
            this.shield[i][1] -= 40;
            this.shield[i][0] -= 30;
        }

        this.shield_on_draw = new Array(this.shield.length);
        this.holding = new Array(100);
        this.holding.setAllNull();
        this.holding_on_draw = new Array(100);
        this.holding_on_draw.setAllNull();


        this.fixedParticles = new Array(400);
        this.fixedParticles.setAllNull();

        this.lighting = new Lightning(this.x, this.y,this.x, this.y);
        
        

    }

    loadAssets(){
        Player.mano_abierta = loadImage('./src/mano-abierta.png'); 
        Player.mano_cerrada = loadImage('./src/mano-cerrada.png'); 
        Player.mano_abierta_pu = loadImage('./src/mano-abierta_pu.png'); 
        Player.mano_cerrada_pu = loadImage('./src/mano-cerrada_pu.png'); 
        Player.shield_sound = new Sound ('./src/shield.mp3',0.02);
        Player.shield_init_sound = new Sound('./src/init_shield.mp3', 0.1);
        Player.shield_feedback_sound = new Sound('./src/siheld_feedback.mp3', 0.02);
        Player.jump_init_sound = new Sound('./src/fall.mp3', 0.02);
        Player.jump_splash_sound = new Sound('./src/jump.mp3',0.01);
    }

    moveFront(){
        this.x += this.directionVector.x*this.speed;
        this.y += this.directionVector.y*this.speed;
    }

    moveToForce(){
        this.x += this.forceVector.x*this.speed;
        this.y += this.forceVector.y*this.speed;
    }

    update(){ 

        for (let i = 0; i < particles.length; i++) {
            if (particles[i] != null && particles[i].opacity <= 0) particles.destroy( i );
            
        }
        
        if(!this.jumping && !this.shield_active && Mouse.right.clicked){
            Player.shield_init_sound.play();
            Player.shield_feedback_sound.play();  
            
        }

        if(this.shield_active && !Mouse.right.clicked){
            
          
            for (let i = 0; i < this.holding_on_draw.length; i++) {
                
                if(this.holding_on_draw[i] != null){
                
                    projectiles.addObj(new Projectile(this.holding_on_draw[i].x, this.holding_on_draw[i].y, new Vector2D(this.holding_on_draw[i].x-this.x, this.holding_on_draw[i].y-this.y,true).getUnitaryVector()));
                    
                }
            }

            this.holding.setAllNull();
            this.holding_on_draw.setAllNull();


        }

        this.shield_active = Mouse.right.clicked && (!this.jumping || this.pu_shield_caught);
        this.shooting = Mouse.left.clicked && (!this.jumping || this.pu_shield_caught);
        this.hand_closed = !this.shield_active && !this.shooting;


        
        
        if(this.shield_active && !Player.shield_sound.playing()){
            Player.shield_sound.loop();
            
        }else if (!this.shield_active && Player.shield_sound.playing()) {

            Player.shield_sound.stop();
            Player.shield_init_sound.play();

        }


        this.particleState += this.particleGenerationSpeed;

        var r = this.radio*1.5;

        if(this.particleState >= this.particlePointToGenerate){
            new Particle(this.x+r + (Math.random() * (r +r) - r) - r, this.y+r+ (Math.random() * (r +r) - r)-r, this.z, this.directionVector.getAngle(), this.health, (this.pu_speed_caught) ? 2:1);
            this.particleState = 0;
            
        }  

        if(this.particleState >= this.particlePointToGenerate/2){
            this.fixedParticles.addObj(new Particle((Math.random() * (r +r) - r) - r, (Math.random() * (r +r) - r)-r, this.z, this.directionVector.getAngle(), this.health, (this.pu_speed_caught) ? 2:1));
        }

        for (let i = 0; i < this.fixedParticles.length; i++) {
         
            if(this.fixedParticles[i] != null){
                this.fixedParticles[i].reference_x = this.x+r;
                this.fixedParticles[i].reference_y = this.y+r;
                this.fixedParticles[i].z = this.z;

                if(this.fixedParticles[i].opacity <= 0) this.fixedParticles.destroy(i);

            }

        }
        



        this.last_x = this.x;
        this.last_y = this.y;

        if(Keyboard.jump.pressed){
            if(!this.jumping) {
                Player.jump_init_sound.play();
                this.jumping = true;
                
            }else {
                if(this.can_splash){
                    Player.jump_splash_sound.play();
                }
            }
            
            this.loading_splash = 0;

            if(this.can_splash){
                this.can_splash = false;
                this.jumping = false;
                this.jumpingSpeed = this.initialJumpingSpeed;
                this.jumpingState = 0;
                this.z = 0;
                this.can_splash = false;
            }
        }

        
        

        

        if(this.jumping){
            this.jump();

        }
        this.move();

        this.orientation = this.directionVector.getAngle();

        if(!this.pu_shield_caught && this.jumping && this.shield_active){
            this.shooting = false;
            this.shield_active = false;
            Player.shield_sound.stop();
            Player.shield_init_sound.play();

            for (let i = 0; i < this.holding_on_draw.length; i++) {
                
                if (this.holding_on_draw[i] != null) {
                    projectiles.addObj(new Projectile(this.holding_on_draw[i].x, this.holding_on_draw[i].y, new Vector2D(this.holding_on_draw[i].x-this.x, this.holding_on_draw[i].y-this.y,true).getUnitaryVector()));
                }
            }

            this.holding.setAllNull();
            this.holding_on_draw.setAllNull();
            
        }

        if (this.shield_active){
            

            this.shield_on_draw = new Array(this.shield.length);

            this.shield_orientation = this.orientation - 90 *( 180/Math.PI);
            
            for (let i = 0; i < this.shield.length; i++) {

                this.shield_on_draw[i] = new Array(2);

                var x = (this.shield[i][0]);
                var y = (this.shield[i][1]);
                
                var cos = Math.cos(this.shield_orientation);
                var sin =  Math.sin(this.shield_orientation);

                this.shield_on_draw[i][0] = this.x + cos * x - sin * y;
                this.shield_on_draw[i][1] = this.y + sin * x + cos * y;  

                
            }


            this.holding_on_draw = new Array(this.holding.length);

            for (let i = 0; i < this.holding.length; i++) {

                if(this.holding[i] != null){
                    this.holding_on_draw[i] = new Array(2);
    
                    var x = (this.holding[i].x);
                    var y = (this.holding[i].y);
                    
                    var cos = Math.cos(this.orientation);
                    var sin =  Math.sin(this.orientation);
    
                    this.holding_on_draw[i].x = this.x + cos * x - sin * y;
                    this.holding_on_draw[i].y = this.y + sin * x + cos * y;  

                }else {
                    this.holding_on_draw[i] = null;
                }

                
            }

        }


        if(this.shooting){
            
            this.lighting.point2 = new SuperVector(this.x+this.directionVector.x*1000, this.y+this.directionVector.y*1000, 0);
            this.lighting.point1 = new SuperVector(this.x, this.y, 0);
    
            this.lighting.point1.w=1;
            this.lighting.point2.w=1;
    
            this.lighting.point1.translate(this.directionVector.x*-7, this.directionVector.y*-7, this.directionVector.z);
            this.lighting.point1.translate(-this.directionVector.y*15, this.directionVector.x*15, this.directionVector.z);

            this.lighting.update();

        }

    }

    jump() {
        this.jumpingState+= this.jumpingSpeed;
        
        this.jumpingSpeed-= this.gravityForce;

        this.z += this.jumpingSpeed/20;
        

        if(this.jumpingState <= 0){
            this.jumping = false;
            this.jumpingSpeed = this.initialJumpingSpeed;
            this.jumpingState = 0;
            this.z = 0;
            this.can_splash = false;
        }


    }

    move(){

        
        if(!this.shield_active && !this.shooting){

            this.directionVector.x += this.forceVector.x/this.rotationDelay;
            this.directionVector.y += this.forceVector.y/this.rotationDelay;
        }
                
        var mustMove = false;

        if( Keyboard.right.pressed && Keyboard.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP_RIGHT;
        }
        else if( Keyboard.left.pressed && Keyboard.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP_LEFT;
        }
        else if( Keyboard.right.pressed && Keyboard.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM_RIGHT;
        }
        else if( Keyboard.left.pressed && Keyboard.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM_LEFT;
        }
        else if( Keyboard.right.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_RIGHT;
        }
        else if( Keyboard.left.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_LEFT;
        }
        else if( Keyboard.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP;
        }
        else if( Keyboard.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM;
        }
        else {

            var x = UMI.toPixel(Camera.translationX(this.x))+windowWidth/2;
            var y = UMI.toPixel(Camera.translationY(this.y))+windowHeight/2;

            this.forceVector = new Vector2D(mouseX-x,mouseY-y).getUnitaryVector();

            
            var AB = new Vector2D(mouseX-x,mouseY-y).getUnitaryVector();

            this.directionVector.x += AB.x/this.rotationDelay;
            this.directionVector.y += AB.y/this.rotationDelay;
            
        }


        if (mustMove && (this.shield_active || this.shooting)){

            var x = UMI.toPixel(Camera.translationX(this.x))+windowWidth/2;
            var y = UMI.toPixel(Camera.translationY(this.y))+windowHeight/2;

            var AB = new Vector2D(mouseX-x,mouseY-y).getUnitaryVector();

            this.directionVector.x += AB.x/this.rotationDelay;
            this.directionVector.y += AB.y/this.rotationDelay;

            this.moveToForce();
            
        } else if(mustMove) {
            this.moveFront();
        }

        this.directionVector.convertToUnitary();

        this.mouse_vector = new Vector2D(mouseX-x,mouseY-y).getUnitaryVector();
    }

    draw(){
        if(this.shooting)
            this.lighting.draw();
        //this.drawVectors();
        
        var hand;
        
        if (!this.pu_doubleproj_caught)
            hand = (this.hand_closed) ? Player.mano_cerrada :Player.mano_abierta;
        else
            hand = (this.hand_closed) ? Player.mano_cerrada_pu :Player.mano_abierta_pu;

        drawingContext.shadowBlur = 50;
        drawingContext.shadowColor = "yellow";

        fill(255, 204, 0);
        stroke(255, 204, 0);
        
        ellipse(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)) ,UMI.toPixel(this.radio*2+this.z), UMI.toPixel(this.radio*2+this.z));
        
        translate(UMI.toPixel(Camera.translationX(this.x)) , UMI.toPixel(Camera.translationY(this.y)));
        rotate(this.directionVector.getAngle() - 90 * (180 / Math.PI));
        
        if(this.shield_active){
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = "red";

        }else{
            drawingContext.shadowBlur = 10;
            
            if(this.health == 1) drawingContext.shadowColor = "blue";
            else if (this.health == 2) drawingContext.shadowColor = "orange";
            
        }
        
        Camera.zoom(this.z*30);
        image(hand, UMI.toPixel(4) , UMI.toPixel(-1) , UMI.toPixel(12), UMI.toPixel(-20));
        rotate(-  (this.directionVector.getAngle()   - 90 * (180 / Math.PI)));
        Camera.zoom(-this.z*30);
        translate(-UMI.toPixel(Camera.translationX(this.x)) , -UMI.toPixel(Camera.translationY(this.y)));
      
        //drawingContext.shadowBlur = 0;




        if (this.shield_active){
            
            drawingContext.shadowOffsetX = 0;
            drawingContext.shadowOffsetY = 0;
            drawingContext.shadowBlur = 40;
            drawingContext.shadowColor = "red";
            fill(100,0,0,Math.floor(Math.random() * 100) + 1  );
            noStroke();
            
            beginShape();
            this.shield_on_draw.forEach(point => {
                vertex(UMI.toPixel(Camera.translationX(point[0])),UMI.toPixel(Camera.translationY(point[1])));
            });
            endShape();

            noStroke();
            fill('orange');
            this.holding_on_draw.forEach(thing => {
                
                if (thing != null) ellipse(UMI.toPixel(Camera.translationX(thing.x)), UMI.toPixel(Camera.translationY(thing.y)), UMI.toPixel(EnemyAway.radio*2), UMI.toPixel(EnemyAway.radio*2));
            
            });
        }

        
    }

    drawVectors(){
        this.drawForce();
        this.drawDirection();
    }

    drawForce(){
        stroke('red');
        line(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),
                        UMI.toPixel(Camera.translationX(this.x+this.forceVector.x*100)),UMI.toPixel(Camera.translationY(this.y+this.forceVector.y*100)));
        stroke('white');
    }
    
    drawDirection(){
        stroke('green');
        line(UMI.toPixel(Camera.translationX(this.x)),UMI.toPixel(Camera.translationY(this.y)),
                        UMI.toPixel(Camera.translationX(this.x+this.directionVector.x*100)),UMI.toPixel(Camera.translationY(this.y+this.directionVector.y*100)));
        stroke('white');
    }

    




}