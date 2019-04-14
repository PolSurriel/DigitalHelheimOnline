class OnlinePlayer extends Player {

    token;
    controller;
    last_mouse_vector = new Vector2D(1,1);

    name;

    constructor(name,token, x, y){
        super(x,y);
        this.token = token;

        this.name = name;

        this.__proto__ = "OnlinePlayer";

        this.controller = new OnlinePlayerDataController();

        this.speed = UMI.getSpeed(100);
        this.rotationDelay = UMI.getDelay(0.05);
        this.initialJumpingSpeed = UMI.getSpeed(800);
        this.jumpingSpeed = this.initialJumpingSpeed;

        this.gravityForce = this.initialJumpingSpeed/23;

        this.particleGenerationSpeed = UMI.getSpeed(20);
        this.particlePointToGenerate = UMI.getSpeed(100);
    }


    move() {
        
        if(this.controller.jump.pressed){
            if(!this.jumping) {
                Player.jump_splash_sound.play();
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


        if(!this.shield_active){

            this.directionVector.x += this.forceVector.x/this.rotationDelay;
            this.directionVector.y += this.forceVector.y/this.rotationDelay;
        }
                
        var mustMove = false;

        if( this.controller.right.pressed && this.controller.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP_RIGHT;
        }
        else if( this.controller.left.pressed && this.controller.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP_LEFT;
        }
        else if( this.controller.right.pressed && this.controller.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM_RIGHT;
        }
        else if( this.controller.left.pressed && this.controller.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM_LEFT;
        }
        else if( this.controller.right.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_RIGHT;
        }
        else if( this.controller.left.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_LEFT;
        }
        else if( this.controller.top.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_TOP;
        }
        else if( this.controller.bottom.pressed){
            mustMove = true;
            this.forceVector = Player.FORCE_BOTTOM;
        }
        else {

            this.forceVector = this.last_mouse_vector;
            var AB = this.last_mouse_vector;

            this.directionVector.x += AB.x/this.rotationDelay;
            this.directionVector.y += AB.y/this.rotationDelay;
            
        }


        if (mustMove &&this.shield_active){

            var AB = this.last_mouse_vector;

            this.directionVector.x += AB.x/this.rotationDelay;
            this.directionVector.y += AB.y/this.rotationDelay;

            this.moveToForce();
        } else if(mustMove) {
            this.moveFront();
        }

        this.directionVector.convertToUnitary();

        var x = UMI.toPixel(Camera.translationX(this.x))+windowWidth/2;
        var y = UMI.toPixel(Camera.translationY(this.y))+windowHeight/2;


    }


    draw(){

        drawingContext.shadowBlur = 0;
        textSize(UMI.toPixel(12));
        fill(255);
        text(this.name, UMI.toPixel(Camera.translationX(this.x)), UMI.toPixel(Camera.translationY(this.y-14))); 
        
        super.draw();

    }

}