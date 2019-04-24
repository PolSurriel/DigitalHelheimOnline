var motor1;

var im_blocked = false;

function coop_battle_setup(){
    initSocket();
    window.onmousedown = online_playing_onmousedown; 
    window.onmouseup   = online_playing_onmouseup; 
    window.onkeydown   = online_playing_onkeydown; 
    window.onkeyup     = online_playing_onkeyup; 
    window.onmousemove = online_playing_onmousemove;

    if(room_music.playing()) room_music.stop();

    cameraReference = new FollowerReference(pj);
    Camera.setObjectReference(cameraReference);
    

    pj.portal_opened = true;
    pj.portal_x = -60;
    pj.portal_y = 0;

    pj.z = 0;

    particles.setAllNull();
    pj.fixedParticles.setAllNull();

    motor1 = new Motor(-400, -400, -1);
    motor2 = new Motor(30, -495, 1);
    motor3 = new Motor(-100, -100, PI);

    boss = new ArduinoActivity7(-157,-300);

    
}




function coop_battle_update(){
    update_all();

    motor1.update();
    motor2.update();
    motor3.update();
    chispas_menu.update();
    littleLightnings.update();
    boss.update();

   
    var x = pj.x - boss.x;
    var y = pj.y - boss.y;
    if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_arm1) ){
        
        
    }
    if ( Collider2D.detector.circleToPolygon( x, y, pj.radio *2, boss.poly_arm2) ){
        

    }
    if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_base) ){
        

    }
    if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_head) ){
        

    }



    var isTrue = false;
    var colPoints = new Array();
    var motors = [motor1, motor2, motor3];
    
    for (let i = 0; i < motors.length; i++) {
        var dist = new Vector2D(pj.x-motors[i].x,pj.y-motors[i].y).getMagnitude();
        if(dist < 170 && Collider2D.detector.circleToPolygon(pj.x,pj.y,pj.radio*2.5,motors[i].poly) ){
            var newPos = Collider2D.reaction.circleToPolygon(pj.last_x,pj.last_y,  pj.x,pj.y,pj.radio*2.5,motors[i].poly);

            if(!isNaN(newPos.x)){
                pj.x = newPos.x;
                pj.y = newPos.y;
            
            }else{
                pj.x = pj.last_x;
                pj.y = pj.last_y;
            }
            
        }


        
        if(pj.shooting){

            var vp = new Vector2D(-(pj.lighting.point2.y - pj.lighting.point1.y), pj.lighting.point2.x - pj.lighting.point1.x).getUnitaryVector();
        
            var test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x,pj.lighting.point1.y, pj.lighting.point2.x,pj.lighting.point2.y,motors[i].poly );
            if (!test.isTrue){
                
                var maxScal = 50;
                for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                    test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                                             pj.lighting.point2.x,pj.lighting.point2.y,motors[i].poly );
                }

                if (!test.isTrue){
                    vp.x = -vp.x;
                    vp.y = -vp.y;
                    for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                        test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                                                 pj.lighting.point2.x,pj.lighting.point2.y,motors[i].poly );
                    }
                }
                
            }

            if(test.isTrue){
                isTrue = true;
                for (let p = 0; p < test.info.length; p++) {
                    colPoints.push(test.info[p]);
                }
                
            }
            
        }

    }

    if(isTrue){

        var minDistance = 9999999999;
        var point;
        for (let p = 0; p < colPoints.length; p++) {
            var distance = new Vector2D(colPoints[p].x-pj.lighting.point1.x, colPoints[p].y-pj.lighting.point1.y).getMagnitude();
            if (distance < minDistance){
                minDistance = distance;
                point = colPoints[p];
            }
        }

        pj.lighting.point2.x = point.x;
        pj.lighting.point2.y = point.y;

        shareLightningPos(point);
        im_blocked = true;

        
        if (chispas_menu.added < 30){
    
            var vector2 = new Vector2D((pj.lighting.point1.x-pj.lighting.point2.x), pj.lighting.point1.y-pj.lighting.point2.y).getUnitaryVector();
            vector2.rotate(Math.random() *3 -2);
            
            chispas_menu.addObj( new Chispa(point.x, point.y, vector2, false, true) );
            quemaduras.addObj( new Quemadura(point.x, point.y, new Vector2D(point.line.p2.x -point.line.p1.x, point.line.p2.y -point.line.p1.y).getAngle() + PI ) );
            
        } 

    } else if (im_blocked){
        unlockMyselfToOthers();
        im_blocked = false;
    }


    
    if(pj.shooting){
        for (let i = 0; i < motors.length; i++) {
            
            motors[i].damaging2 = false;
            motors[i].damaging1 = false;

            if (Collider2D.detector.pointToCircle(pj.lighting.point2.x,pj.lighting.point2.y, 
                motors[i].point1[0],motors[i].point1[1], 
                motors[i].radio_points/1.5 )){
                    pj.lighting.point2.x = motors[i].point1[0];
                    pj.lighting.point2.y = motors[i].point1[1];
                    motors[i].damaging1 = true;
                    break;


            }else if(Collider2D.detector.pointToCircle(pj.lighting.point2.x,pj.lighting.point2.y, 
                motors[i].point2[0],motors[i].point2[1],
                    motors[i].radio_points/1.5)) {
                        pj.lighting.point2.x = motors[i].point2[0];
                        pj.lighting.point2.y = motors[i].point2[1];
                        motors[i].damaging2 = true;
                        break;

            }
        }

    }else {
        for (let i = 0; i < motors.length; i++) {
            motors[i].damaging1 = false;
            motors[i].damaging2 = false;
        }
    }

    
}

function coop_battle_draw(){
    translate(width/2,height/2);
    scale(Camera.zoom);

    background(0);

    var w = 405/1.2;
    var h = 327/1.2;

    relative_regulation_x = cameraReference.x-(cameraReference.x % w);
    relative_regulation_y = cameraReference.y-(cameraReference.y % h);;

    var x = -w/2;
    var y = -h/2;

    drawingContext.shadowBlur = 0;
    var currentY = y;
    var multiplerY = 0;
    for (let j = 0; j < (window.innerWidth/UMI.toPixel(h))/2+1; j++) {
        var multipler = 0;
        for (let i = 0; i < (window.innerWidth/UMI.toPixel(w))/2+2; i++) {    
        
            image(bg_texture, UMI.toPixel(Camera.translationX(-x-x*multipler+relative_regulation_x)), UMI.toPixel(Camera.translationY(currentY+relative_regulation_y)), UMI.toPixel(w), UMI.toPixel(h));
            image(bg_texture, UMI.toPixel(Camera.translationX(x+x*multipler+relative_regulation_x)), UMI.toPixel(Camera.translationY(currentY+relative_regulation_y)), UMI.toPixel(w), UMI.toPixel(h));
            image(bg_texture, UMI.toPixel(Camera.translationX(-x-x*multipler+relative_regulation_x)), UMI.toPixel(Camera.translationY(-currentY+relative_regulation_y)), UMI.toPixel(w), UMI.toPixel(h));
            image(bg_texture, UMI.toPixel(Camera.translationX(x+x*multipler+relative_regulation_x)), UMI.toPixel(Camera.translationY(-currentY+relative_regulation_y)), UMI.toPixel(w), UMI.toPixel(h));
                
            multipler+=2;
        }
        multiplerY+=2;
        currentY = y+y*multiplerY;
    }

    
    drawingContext.shadowBlur = 0;
    enemies.draw();
    enemiesAway.draw();
    enemiesWaves.draw();
    enemiesLines.draw();
    projectiles.draw();
    waves.draw();
    linesShoot.draw();
    enemiesProjectiles.draw();

    online_players.draw();
    pj.draw();
    particles.draw();
    
    chispas_menu.draw();
    hexagons.draw();
    motor1.draw();
    motor2.draw();
    motor3.draw();
    quemaduras.draw();
    littleLightnings.draw();
    boss.draw();
    

    Cursor.draw();

    fill(255,255,255,100);
    textAlign(RIGHT);
    noStroke();
    textSize(10);
    text('DigitalHelheim - ENTI-UB AA1 Álgebra 1º CDI Grupo A (Mañanas) / Alumnos: Pol Surriel y Eric Garcia',window.innerWidth/2.02,-window.innerHeight/2.05);

}

var beats = 0;
function invoke_a_boss(){
    boss.invoking = true;
    a7_song.loop();

    setTimeout(() => {
        boss.dancing = true;
        setInterval(() => {
            beats++;
            boss.dance_normal = true;
            if (beats % 5 == 4){
                beats++;
                boss.dance_normal = false;
                //PAM
            }
            boss.dance_direction = beats % 2;

            
        }, 451);
            

        
    }, 15000);
    
    
}

function coop_battle_gameloop(){
    coop_battle_update();
    coop_battle_draw();
}