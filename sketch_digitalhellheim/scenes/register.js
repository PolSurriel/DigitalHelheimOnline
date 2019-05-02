var cursorON = false;
var name = '';

var title_particles = new Array (100);
var ambiental_particles = new Array(100);
var chispas_menu = new Array (300);

var haciendo_chispas = false;
var creadas = 0;

var wall_on_create;
var variancia;

var li;

var li_mode1 = 0;
var li_mode2 = 1;
var li_speed = 100;
var display_li = false;

// var mBall = {
//     position: new SuperVector(100, 100, 0),
//     size:     new SuperVector( 20,  20, 0),
// }

// mBall.draw = function () {

//     ellipse( 
//         UMI.toPixel(Camera.translationX(this.position.x)), 
//         UMI.toPixel(Camera.translationY(this.position.y)), 
//         this.size.x, 
//         this.size.y
//     );

//     ellipse( 
//         UMI.toPixel(Camera.translationX(200)), 
//         UMI.toPixel(Camera.translationY(200)), 
//         5, 
//         5
//     );

// }

function register_setup(){

    //menu_music.loop();

    li = new Lightning(UMI.toUMI(window.innerWidth-window.innerWidth/1.8),0,UMI.toUMI(window.innerWidth),500);

    title_particles.setAllNull();
    ambiental_particles.setAllNull();
    chispas_menu.setAllNull();

    cameraReference = new FollowerReference({x:0,y:0});
    Camera.setObjectReference(cameraReference);

    translate(1000,0,0);

    
    if(isMobileDevice()){

      
        document.getElementById('screen').innerHTML += `
        
        <div id="jump-button" style="position:fixed; background-color:gray;border-radius: 50%;" >
        </div>
        
        `;
        
        window.jump_button = document.getElementById('jump-button');
        
        
        setTimeout(() => {
          
          var w = Math.floor(UMI.toPixel(120));
          
          
          jump_button.style.width = w+'px';
          jump_button.style.height = w+'px';
          jump_button.style.opacity = 0.3;
          jump_button.style.marginLeft = window.innerWidth - window.innerWidth*0.2;
          jump_button.style.marginTop = window.innerHeight - window.innerHeight*0.2;
          
          jump_button.onclick = function (e){
            onJump(e);
          }
          
        }, 2000);
        
      }
    


}

function register_gameloop(){
    register_update();
    register_draw();
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function register_update(){

    // rotar entorno eje axis: ------------
    // var axis = {x:200, y:200};
    // var radians = 0.1;
    // mBall.position.translate(0, 50, 0);
    // mBall.position.rotateZ(radians);
    // mBall.position.translate(axis.x, axis.y, 0);
    // mBall.position.rotateAxisZ(axis, radians);


    // scalar: -----------------
    // mBall.size.scale(1.1, 1.1, 0);
    

    li.update();

    if(li_mode1 == 0){
        li.point1.x += UMI.getSpeed(li_speed);
        if(li.point1.x > UMI.toUMI(window.innerWidth)){
            li.point1.x = UMI.toUMI(window.innerWidth);
            li_mode1++;
        }

        
        if(display_li){
            var direction = new Vector2D (li.point2.x - li.point1.x ,li.point2.y - li.point1.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x+Math.random() * (2)  -1, direction.y);
            chispas_menu.addObj( new Chispa(li.point1.x, li.point1.y, vector1,true) );
        }

    } else if(li_mode1 == 1){
        li.point1.y += UMI.getSpeed(li_speed);
        if(li.point1.y > UMI.toUMI(window.innerHeight)){
            li.point1.y = UMI.toUMI(window.innerHeight);
            li_mode1++;
        }

        if(display_li){
            var direction = new Vector2D (li.point2.x - li.point1.x ,li.point2.y - li.point1.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x, direction.y+Math.random() * (2)  -1);
            chispas_menu.addObj( new Chispa(li.point1.x, li.point1.y, vector1,true) );
        }

    } else if(li_mode1 == 2){
        li.point1.x -= UMI.getSpeed(li_speed);
        if(li.point1.x < 0){
            li.point1.x = 0;
            li_mode1++;
        }

        if(display_li){
            var direction = new Vector2D (li.point2.x - li.point1.x ,li.point2.y - li.point1.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x+Math.random() * (2)  -1, direction.y);
            chispas_menu.addObj( new Chispa(li.point1.x, li.point1.y, vector1,true) );
        }

    } else{
        li.point1.y -= UMI.getSpeed(li_speed);
        if(li.point1.y < 0){
            li.point1.y = 0;
            li_mode1 = 0;
        }

        if(display_li){
            var direction = new Vector2D (li.point2.x - li.point1.x ,li.point2.y - li.point1.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x, direction.y+Math.random() * (2)  -1);
            chispas_menu.addObj( new Chispa(li.point1.x, li.point1.y, vector1,true) );
        }

    }

    if(li_mode2 == 0){
        li.point2.x += UMI.getSpeed(li_speed);
        if(li.point2.x > UMI.toUMI(window.innerWidth)){
            li.point2.x = UMI.toUMI(window.innerWidth);
            li_mode2++;
        }

        if(display_li){

            var direction = new Vector2D (li.point1.x - li.point2.x ,li.point1.y - li.point2.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x+Math.random() * (2)  -1, direction.y);
            chispas_menu.addObj( new Chispa(li.point2.x, li.point2.y, vector1,true) );
        }
        
    } else if(li_mode2 == 1){
        li.point2.y += UMI.getSpeed(li_speed);
        if(li.point2.y > UMI.toUMI(window.innerHeight)){
            li.point2.y = UMI.toUMI(window.innerHeight);
            li_mode2++;
        }

        if(display_li){
            var direction = new Vector2D (li.point1.x - li.point2.x ,li.point1.y - li.point2.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x, direction.y+Math.random() * (2)  -1);
            chispas_menu.addObj( new Chispa(li.point2.x, li.point2.y, vector1,true) );
        }

    } else if(li_mode2 == 2){
        li.point2.x -= UMI.getSpeed(li_speed);
        if(li.point2.x < 0){
            li.point2.x = 0;
            li_mode2++;
        }

        

        
        if(display_li){
            var direction = new Vector2D (li.point1.x - li.point2.x ,li.point1.y - li.point2.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x+Math.random() * (2)  -1, direction.y);
            chispas_menu.addObj( new Chispa(li.point2.x, li.point2.y, vector1,true) );
        }

    } else{
        li.point2.y -= UMI.getSpeed(li_speed);
        if(li.point2.y < 0){
            li.point2.y = 0;
            li_mode2 = 0;
        }

        if(display_li){
            var direction = new Vector2D (li.point1.x - li.point2.x ,li.point1.y - li.point2.y).getUnitaryVector();
            vector1 = new Vector2D(direction.x, direction.y+Math.random() * (2)  -1);
            chispas_menu.addObj( new Chispa(li.point2.x, li.point2.y, vector1,true) );
        }

    }


    if(!display_li){
        display_li =  1 == (Math.floor(Math.random() * (100 - 1) ) + 1);
        
        if(display_li){
            //chispa_sound.loop();
            li_speed = 100;
        }
    }else if (1 == (Math.floor(Math.random() * (50 - 1) ) + 1)) {
        display_li = false;
        li_speed = 900000;
        //chispa_sound.stop();
    }

    
    if(li_mode1 == li_mode2){
        display_li = false;
        //chispa_sound.stop();
    }




    
    cursorON = new Date().getSeconds()%2 == 1;


    if(title_particles.added < 100){
        title_particles.addObj(new Particle2(170,getRndInteger(245,275)));   
    }

    if(ambiental_particles.added < 100){
        ambiental_particles.addObj(new Particle3(getRndInteger(0,window.innerWidth),getRndInteger(0,window.innerHeight)));   
    }

    if(!haciendo_chispas){
        haciendo_chispas =  1 == (Math.floor(Math.random() * (100 - 1) ) + 1);
        creadas = 0;
        wall_on_create = getRndInteger(1,5);
        variancia = getRndInteger(10, 90);
        if(haciendo_chispas){
            //chispa2_sound.loop();
        }

    }else {
        if ( chispas_menu.added < 100 ){


            var x_on_create;
            var y_on_create;
            var vector1, vector2;
            
            if (wall_on_create == 1) {
                x_on_create = UMI.toUMI(window.innerWidth);
                y_on_create = UMI.toUMI((window.innerHeight*variancia)/100);
                vector1 = new Vector2D(-10, getRndInteger(5,-10));
                vector2 = new Vector2D(-10, getRndInteger(5,-10));

            } else if (wall_on_create == 2){
                x_on_create = UMI.toUMI(0);
                y_on_create = UMI.toUMI((window.innerHeight*variancia)/100);
                vector1 = new Vector2D(10, getRndInteger(5,-10));
                vector2 = new Vector2D(10, getRndInteger(5,-10));

            }else if (wall_on_create == 3){
                x_on_create = UMI.toUMI((window.innerWidth*variancia)/100);
                y_on_create = UMI.toUMI(window.innerHeight);
                vector1 = new Vector2D(getRndInteger(5,-10), -10);
                vector2 = new Vector2D(getRndInteger(5,-10), -10);

            }else {
                x_on_create = UMI.toUMI((window.innerWidth*variancia)/100);
                y_on_create = UMI.toUMI(0);
                vector1 = new Vector2D(getRndInteger(5,-10), 10);
                vector2 = new Vector2D(getRndInteger(5,-10), 10);
            }

            chispas_menu.addObj( new Chispa(x_on_create, y_on_create, vector1) );
            chispas_menu.addObj( new Chispa(x_on_create, y_on_create, vector2) );
            
            
            creadas ++;
        }

        haciendo_chispas = creadas < 15;
        if(creadas > 10){
            //chispa2_sound.stop();
        }

    }



    title_particles.update();
    ambiental_particles.update();
    chispas_menu.update();


}

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str) && str.length == 1;
}

var DEL_KEY = 8;
var INTRO_KEY = 13;
var MAX_NAME_LEN = 16;

function register(){
    
    noCursor();

    registrado = true;

    textFont(font_p);
    room_setup();

}

function validate(){
    return name.length > 2;
}

window.onkeydown = function(e) {


    if(e.keyCode == INTRO_KEY){

        if(validate()){
            register();
        }


    } else if(e.keyCode == DEL_KEY){
        
        name = name.substring(0, name.length - 1);

    }else {
        
        if(isASCII(e.key) && name.length < MAX_NAME_LEN)
            name += e.key;

    }


}

function register_draw(){

    background(0);
    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor = "rgba(100,0,0,250)";
    fill(150,0,0,150);
    stroke(0,0,0,0);

    rect(-1,-1,window.innerWidth, window.innerHeight+1);
    
    title_particles.draw();
    ambiental_particles.draw();
    chispas_menu.draw();
    if(display_li) li.draw();

    fill(255,255,255,255);
    textSize(UMI.toPixel(100));
    textAlign(CENTER, CENTER);

    noStroke();

    
    textFont(font2);
    text("DigitalHelheim         ", window.innerWidth/2, window.innerHeight/3);

    
    textFont(font);
    text('                Online', window.innerWidth/2-UMI.toPixel(7), window.innerHeight/3);
    
    textSize(UMI.toPixel(20));
    text('                                                                                                  PRE-ALPHA', window.innerWidth/2, window.innerHeight/2.4 );
    
    drawingContext.shadowBlur = 0;
    textFont(PIXEL_ARIAL);
    textSize(UMI.toPixel(50));
    text('Display name:', window.innerWidth/2, window.innerHeight/1.9);
    
    
    textSize(UMI.toPixel(80));
    if(cursorON)
        text(name+'|', window.innerWidth/2, window.innerHeight/1.7);
    else
        text(name+' ', window.innerWidth/2, window.innerHeight/1.7);
    
    textSize(UMI.toPixel(30));
    text('- Press ENTER to continue -', window.innerWidth/2, window.innerHeight/1.5);

    fill(0);
    rect( UMI.toPixel( Camera.translationX( 950)), UMI.toPixel(Camera.translationY(200)),UMI.toPixel(300),UMI.toPixel(160) );

    fill(255)
    textSize(UMI.toPixel(60));
    text('ESTO ES \n SPOILER...', UMI.toPixel(Camera.translationX(1100)), UMI.toPixel(Camera.translationY(280)));

}
