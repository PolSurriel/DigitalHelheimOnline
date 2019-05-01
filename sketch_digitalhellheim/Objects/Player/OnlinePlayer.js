class OnlinePlayer extends Player {

    token;
    controller;
    last_mouse_vector = new Vector2D(1,1);

    name;

    alive = true;

    constructor(name,token, x, y){
        super(x,y);
        this.token = token;
        this.is_online = true;
        this.name = name;

        this.__proto__ = "OnlinePlayer";

        this.controller = new OnlinePlayerDataController();
        
        this.render_blur = false;

        this.lighting.render_blur = false;

        this.can_shoot = false;
    }

    setInmuneState(){
        this.inmune = true;
        setTimeout(() => {
            this.inmune = false;
        }, 7000);
    }

    mousCkeck(){

        
        if(!this.shield_active || !this.controller.mRight.clicked){
            
            for (let i = 0; i < this.holding_on_draw.length; i++) {
                
                if(this.holding_on_draw[i] != null){
                
                    //projectiles.addObj(new Projectile(this.holding_on_draw[i].x, this.holding_on_draw[i].y, new (this.holding_on_draw[i].x-this.x, this.holding_on_draw[i].y-this.y,true).getUnitaryVector()));
                    enemiesAway.addObj( new EnemyAway (this.holding_on_draw[i].x, this.holding_on_draw[i].y) );

                }
            }

            this.holding.setAllNull();
            this.holding_on_draw.setAllNull();

        }


        if(!this.jumping && !this.shield_active && this.controller.mRight.clicked){
            Player.shield_init_sound.play();
            Player.shield_feedback_sound.play();  
            
        }

        if(this.shield_active && !this.controller.mRight.clicked){
            
            for (let i = 0; i < this.holding_on_draw.length; i++) {
                
                if(this.holding_on_draw[i] != null){
                
                    projectiles.addObj(new Projectile(this.holding_on_draw[i].x, this.holding_on_draw[i].y, new Vector2D(this.holding_on_draw[i].x-this.x, this.holding_on_draw[i].y-this.y,true).getUnitaryVector()));
                    
                }
            }

            this.holding.setAllNull();
            this.holding_on_draw.setAllNull();

        }

        this.shield_active = this.controller.mRight.clicked && (!this.jumping || this.pu_shield_caught);
        this.shooting = this.can_shoot  && (this.controller.mLeft.clicked && (!this.jumping || this.pu_shield_caught));

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


    }


    draw(){


        if(this.alive){
            super.draw();
            drawingContext.shadowBlur = 0;
            textSize(UMI.toPixel(22));
            fill(255);
            noStroke();
            textAlign(CENTER);
            text(this.name, UMI.toPixel(Camera.translationX(this.x)), UMI.toPixel(Camera.translationY(this.y-17))); 
            textAlign(RIGHT);
        
        }


    }

}