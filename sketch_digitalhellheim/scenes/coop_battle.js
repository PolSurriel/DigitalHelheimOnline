var motor1;
var im_blocked = false;
var restorer;

var damagenumbersControl = 0;

var damage_to_boss;

var invocation_has_been_called = false;

var motorsDamage = [ false,false,false,false,false,false ];

var time = {
    sec:0,
    min:10
}

function incrementTime(){
    if (--time.sec < 0){
        time.sec = 59;
        time.min--;
    }
}

function allDamageActive(){

    for (let i = 0; i < motorsDamage.length; i++) {
        if(motorsDamage[i] == false) return false;
    }

    return true;
}

window.el_punto = new Vector2D(0,0);
function coop_battle_setup(){




    online = true;
    initSocket();

    askForRoomState();

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

    pj.y = 0;
    pj.x = 0;
    pj.z = 0;

    particles.setAllNull();
    pj.fixedParticles.setAllNull();

    motor1 = new Motor(-400, -400, -1);
    motor2 = new Motor(30, -495, 1);
    motor3 = new Motor(-100, -100, PI);

    boss = new ArduinoActivity7(-157,-300);
    restorer = new Restorer(-195+37,-336+37);

    
   
}

function coop_battle_update(){

    if (time.min == 0 && time.sec <= 0){

        location.reload();
    }

    if(!boss.invoked && allDamageActive()){
        invoke_a_boss();
    }


    if(boss.shield_active && boss.in_floor && allDamageActive()){
        
        boss.shield_active = false;
        setTimeout(() => {
            boss.shield_active = true;
        }, 20 * 1000);

    }


    if (boss.health <= 0){
        boss.invoked = false;
        boss.in_floor = false;
        clearInterval(dancingInterval);
        a7_song.stop();

    }

    damage_to_boss = (10*30) / (online_players.added +1);

    damagenumbers.update();
    restorer.update();
    update_all();
    a7Projectiles.update();
    a7Projectiles_Collision();
    
    motor1.update();
    motor2.update();
    motor3.update();
    chispas_menu.update();
    littleLightnings.update();
    boss.update();
    
    if (pj.alive && !pj.inmune && !restorer.following && restorer.reference != pj && Collider2D.detector.circleToPoint(restorer.x, restorer.y, restorer.distance_to_infect, pj.x, pj.y) ){
        // AVISAR AL SERVIDOR
        restorer.reference = pj;
        restorer.following = true;
        restorer.inComing = true;
        pj.infected = true;

        iGotTheRestorer();
    }


    var colPoints = new Array();
    
   
    if (boss.in_floor) {
        var x = pj.x - boss.x;
        var y = pj.y - boss.y;

        if(boss.shield_active){
            if ( Collider2D.detector.circleToCircle(pj.x,pj.y,boss.x,boss.y,180, pj.radio) ){
                pj.die();
                shareDeath();
            }
        }else {
            
            if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_arm1) ){
                pj.die();
                shareDeath();
                
            }
            if ( Collider2D.detector.circleToPolygon( x, y, pj.radio *2, boss.poly_arm2)){
                pj.die();
                shareDeath();
                
            }
            if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_base) ){
                pj.die();
                shareDeath();
                
            }
            if ( Collider2D.detector.circleToPolygon( x, y, pj.radio*2, boss.poly_head) ){
                pj.die();
                shareDeath();
                
            }
        }



        var bIsTrue = false;
        var parts = [boss.poly_head, boss.poly_base, boss.poly_arm2,boss.poly_arm1];

        var lp1 = {
                x : pj.lighting.point1.x-boss.x,
                y : pj.lighting.point1.y-boss.y
            };
        var lp2 = {
            x : pj.lighting.point2.x-boss.x,
            y : pj.lighting.point2.y-boss.y
        };

        
        if (boss.shield_active) {
            var vp = new Vector2D(-(pj.lighting.point2.y - pj.lighting.point1.y), pj.lighting.point2.x - pj.lighting.point1.x).getUnitaryVector();


            var dist_to_col = 180;
            if(pj.shooting && Collider2D.detector.lineToCircle(lp1.x,lp1.y,lp2.x,lp2.y, 0,0, dist_to_col)){



                var nlp1 = new Vector2D(lp1.x,lp1.y);
                var nlp2 = new Vector2D(lp2.x,lp2.y);
                nlp2.x = boss.x-lp2.x;
                nlp2.y = boss.y-lp2.y;

                var a1 = nlp1.getAngle();
                var a2 = nlp2.getAngle();
    
                nlp1.rotate( a1-a2 );

                
                var vd = nlp1.getUnitaryVector();
                vd.x = boss.x+ vd.x*dist_to_col;
                vd.y = boss.y+ vd.y*dist_to_col;


                colPoints.push( {
                    x:vd.x,
                    y:vd.y,
                    line:{
                        p1:vd,
                        p2:vd
                    }
                });

                bIsTrue = true;

                

            }
        }else {

            for (let i = 0; i < parts.length; i++) {
                var dist = new Vector2D(pj.x-parts[i].x,pj.y-parts[i].y).getMagnitude();
                

                if(pj.shooting){

                    var vp = new Vector2D(-(pj.lighting.point2.y - pj.lighting.point1.y), pj.lighting.point2.x - pj.lighting.point1.x).getUnitaryVector();
                
                    var test = Collider2D.detector.lineToPolygon(lp1.x,lp1.y, lp2.x,lp2.y,parts[i] );
                    if (!test.isTrue){1
                        
                        var maxScal = 50;
                        for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                            test = Collider2D.detector.lineToPolygon(lp1.x+vp.x*scal,lp1.y+vp.y*scal, 
                                                                    lp2.x,lp2.y,parts[i] );
                        }

                        if (!test.isTrue){
                            vp.x = -vp.x;
                            vp.y = -vp.y;
                            for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                                test = Collider2D.detector.lineToPolygon(lp1.x+vp.x*scal,lp1.y+vp.y*scal, 
                                                                        lp2.x,lp2.y,parts[i] );
                            }
                        }
                        
                    }

                    if(test.isTrue){
                        bIsTrue = true;
                        for (let p = 0; p < test.info.length; p++) {
                            var pointadding = test.info[p];

                            pointadding.x += boss.x;
                            pointadding.y += boss.y; 

                            pointadding.isBoss = true;
                            colPoints.push(pointadding);
                        }
                        
                    }
                    
                }   
                
            }
        }


    }


    var isTrue = false;
    var motors = [motor1, motor2, motor3];
    
    for (let i = 0; i < motors.length; i++) {

        for (let p = 0; p < a7Projectiles.length; p++) {

            if(a7Projectiles[p] != null){
                var dist = new Vector2D(a7Projectiles[p].x-motors[i].x,a7Projectiles[p].y-motors[i].y).getMagnitude();
                if(dist < 170 && Collider2D.detector.circleToPolygon(a7Projectiles[p].x,a7Projectiles[p].y,a7Projectiles[p].radio*2.5,motors[i].poly) ){
                   
                    var founded = false;
                    var x1,y1;
                    var x2,y2;

                    var polygon = motors[i].poly;
                    var x_circle = a7Projectiles[p].x;
                    var y_circle = a7Projectiles[p].y;
                    var radio = a7Projectiles[p].radio;

                    for (let l=0, j = polygon.length -1; l < polygon.length && !founded; j = l++) {


                        if ( Collider2D.detector.lineToCircle(polygon[l][0],polygon[l][1], polygon[j][0],polygon[j][1], x_circle,y_circle,radio)) {
                            x1 = polygon[l][0];
                            y1 = polygon[l][1];
                            x2 = polygon[j][0];
                            y2 = polygon[j][1];
                            founded = true;
                            
                        }
                    }


                    if(founded){
                        var u = a7Projectiles[p].direction;
                        var v = new Vector2D(x2 - x1, y2 - y1);
                        
                        a7Projectiles[p].direction = Vector2D.getReboundVector(u,v);
    
                    }



                   
                   

               }

            }
            
        }


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

    if(isTrue || bIsTrue){

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

        if (point.isBoss &&  Collider2D.detector.pointToCircle(point.x,point.y, 25+boss.poly_damage_point[0][0]+boss.x,boss.poly_damage_point[0][1]+boss.y, 15 ) ){
            damagenumbersControl += Math.floor(UMI.getSpeed(100));

            if (!boss.shield_active && damagenumbersControl % 20  == 1){
                damagenumbers.addObj( new DamageNumber(point.x+ Math.random() * 50 -20,point.y - 10 - Math.random() * 30, 300 + Math.floor(Math.random()*77), true) );
                boss.health -= UMI.getSpeed(damage_to_boss);
                damageToA7(UMI.getSpeed(damage_to_boss));
            }
        }else if (point.isBoss && !boss.shield_active && Collider2D.detector.pointToCircle(point.x, point.y,boss.x,boss.y,180) ) {

            damagenumbersControl += Math.floor(UMI.getSpeed(100));

            if (damagenumbersControl % 20  == 1){
                damagenumbers.addObj( new DamageNumber(point.x+ Math.random() * 50 -20,point.y - 10 - Math.random() * 30, 10 + Math.floor(Math.random()*37), false) );
                boss.health -= UMI.getSpeed(damage_to_boss / 5);
                damageToA7(UMI.getSpeed(damage_to_boss / 5));
            }

        }

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

            var haveToAdviceActivation1 = !motors[i].damaging1; 
            var haveToAdviceActivation2 = !motors[i].damaging2;

            var haveToAdviceDesactivation1 = motors[i].damaging1; 
            var haveToAdviceDesactivation2 = motors[i].damaging2; 
            
            motors[i].damaging2 = false;
            motors[i].damaging1 = false;


            if (Collider2D.detector.pointToCircle(pj.lighting.point2.x,pj.lighting.point2.y, 
                motors[i].point1[0],motors[i].point1[1], 
                motors[i].radio_points/1.5 )){
                    pj.lighting.point2.x = motors[i].point1[0];
                    pj.lighting.point2.y = motors[i].point1[1];
                    motors[i].damaging1 = true;
                    if(haveToAdviceActivation1 ){
                        if (i == 0)
                            activeMotorDamage(0);
                        else if (i == 1)
                            activeMotorDamage(2);
                        else if (i == 2)
                            activeMotorDamage(4);
                    }
                    break;


            }else if(Collider2D.detector.pointToCircle(pj.lighting.point2.x,pj.lighting.point2.y, 
                motors[i].point2[0],motors[i].point2[1],
                    motors[i].radio_points/1.5)) {
                        pj.lighting.point2.x = motors[i].point2[0];
                        pj.lighting.point2.y = motors[i].point2[1];
                        motors[i].damaging2 = true;
                        if(haveToAdviceActivation2 ){
                            if (i == 0)
                            activeMotorDamage(1);
                        else if (i == 1)
                            activeMotorDamage(2);
                        else if (i == 2)
                            activeMotorDamage(5);
                        }
                        break;

            }


            

            if(haveToAdviceDesactivation1 && motors[i].damaging1 == false ){
                if (i == 0)
                    desactiveMotorDamage(0);
                else if (i == 1)
                    desactiveMotorDamage(2);
                else if (i == 2)
                    desactiveMotorDamage(4);
            }
            if(haveToAdviceDesactivation2 && motors[i].damaging2 == false ){
                if (i == 0)
                   desactiveMotorDamage(1);
                else if (i == 1)
                    desactiveMotorDamage(3);
                else if (i == 2)
                    desactiveMotorDamage(5);
            }

            

        }

    }else {
        for (let i = 0; i < motors.length; i++) {

            var haveToAdviceDesactivation1 = motors[i].damaging1; 
            var haveToAdviceDesactivation2 = motors[i].damaging2; 
            
            if (!motors[i].damaging1Blocked) motors[i].damaging1 = false;
            if (!motors[i].damaging1Blocked) motors[i].damaging2 = false;


            if(haveToAdviceDesactivation1 ){
                if (i == 0)
                    desactiveMotorDamage(0);
                else if (i == 1)
                    desactiveMotorDamage(2);
                else if (i == 2)
                    desactiveMotorDamage(4);
            }
            if(haveToAdviceDesactivation2 ){
                if (i == 0)
                   desactiveMotorDamage(1);
                else if (i == 1)
                    desactiveMotorDamage(3);
                else if (i == 2)
                    desactiveMotorDamage(5);
            }
        }

        //hay que enviar desbloqueo cuando deje de disparar
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
    waves.draw();
    linesShoot.draw();
    enemiesProjectiles.draw();

    a7Projectiles.draw();
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
    restorer.draw();    
    boss.draw();
    

    Cursor.draw();

    fill(255,255,255,100);
    textAlign(RIGHT);
    noStroke();
    textSize(2*10);
    text('DigitalHelheim - ENTI-UB AA2 Algebra 1ro CDI Grupo A (Mananas) / Alumnos: Pol Surriel y Eric Garcia',window.innerWidth/2.02,-window.innerHeight/2.05);

    damagenumbers.draw();

    if(!pj.alive){
        stroke(255);
        fill(150,0,0);
        textSize(UMI.toPixel(100));
        text('You have died <3', UMI.toPixel( Camera.translationX( cameraReference.x ) ),UMI.toPixel( Camera.translationY( cameraReference.y ) ));

        fill(0,150,0);
        textSize(UMI.toPixel(50));
        text('Respan in: '+pj.respawn_countdown, UMI.toPixel( Camera.translationX( cameraReference.x ) ),UMI.toPixel( Camera.translationY( cameraReference.y+50 ) ));
        
    }

    /*
    ellipse(  
        UMI.toPixel( Camera.translationX(el_punto.x) ) ,   
        UMI.toPixel( Camera.translationY(el_punto.y) ),
20,20

    );

    */


   stroke(255);
   fill(150,0,0);
   textAlign(CENTER);
   
   var txt = time.min+':'+time.sec; 
   if (time.sec == 0) txt += '0';
   else if ((time.sec+'').length == 1) txt = time.min+':0'+time.sec;
   if ((time.min < 10)) txt = '0'+txt; 
   
   if (in_host_mode) {
    textSize(UMI.toPixel(200));
    text(txt, UMI.toPixel(  0  ),UMI.toPixel(  -440  ));
       
   }else {
       textSize(UMI.toPixel(100));
       text(txt, UMI.toPixel(  0  ),UMI.toPixel(  -340  ));

   }
   textAlign(LEFT);


}



var beats = 0;
function invoke_a_boss(){

    if(!invocation_has_been_called){

        setInterval(() => {
            incrementTime();
        }, 1000);

        shareA7Invocation();
        boss.invoking = true;
        a7_song.loop();

        setTimeout(() => {
            boss.dancing = true;


            window.dancingInterval = setInterval(() => {
        

                beats++;
                boss.dance_normal = true;

                if (beats % 5 == 4){
                    beats++;
                    boss.dance_normal = false;
                    
                    // BOSS SHOOTING
                    if(Math.random() * 100 > 70 ){
                        var aux = new A7Projectile( boss.x+boss.arm_pos.x-50, boss.y+boss.arm_pos.y+60, new Vector2D(-3,4).getUnitaryVector(),pj );

                        a7Projectiles.addObj (  aux );
                        createA7Projectile([boss.x+boss.arm_pos.x-50, boss.y+boss.arm_pos.y+60, -3,4], aux.obj_id);
                    }

                    if(Math.random() * 100 > 70 ){
                        var aux = new A7Projectile( boss.x+boss.arm_pos.x+50, boss.y+boss.arm_pos.y+60, new Vector2D(3,4).getUnitaryVector(),pj );

                        a7Projectiles.addObj (  aux );
                        createA7Projectile([boss.x+boss.arm_pos.x+50, boss.y+boss.arm_pos.y+60, 3,4], aux.obj_id);
                    }
                    
                }else if (beats % 2){
                    boss.arm_pos.x = -10;
                    boss.dance_direction = 1;

                    boss.arms_orientation = -0.02;
                    
                }else {
                    boss.arm_pos.x = 10;
                    boss.dance_direction = -1;

                    boss.arms_orientation = 0.02;
                }

                
            }, 451);
                    
        }, 15000);
            
    }
    
    invocation_has_been_called = true;

    
}

function coop_battle_gameloop(){
    coop_battle_update();
    coop_battle_draw();
}

function a7Projectiles_Collision(){
    
    //PROJECTILES COLLISION
    for (let i = 0; i < a7Projectiles.length; i++) {

        if(a7Projectiles[i] != null && !pj.jumping){

            if(!a7Projectiles[i].reference.alive) a7Projectiles[i].following = false;
            if (Collider2D.detector.circleToCircle(a7Projectiles[i].x, a7Projectiles[i].y, pj.x, pj.y, pj.radio, a7Projectiles[i].radio*3)  ){
                pj.die();
                shareDeath();

                destroyA7Projectile(a7Projectiles[i]);
                a7Projectiles.destroy(i);
            }
        }

        if(a7Projectiles[i] != null && !a7Projectiles[i].boss_is_shooting){

            // COLISION CON EL BOSS
            var polygonDetections = 0;
            var forceRebound = new Vector2D(0,0);
            var polygonsToRebound = [boss.poly_head, boss.poly_base, boss.poly_arm2,boss.poly_arm1];

            for (let k = 0; k < polygonsToRebound.length; k++) {

                if(Collider2D.detector.circleToPolygon( a7Projectiles[i].x-boss.x, a7Projectiles[i].y-boss.y, a7Projectiles[i].radio,polygonsToRebound[k] ) ){
                    
                    var founded = false;
                    var x1,y1;
                    var x2,y2;

                    var polygon = polygonsToRebound[k];
                    var x_circle = a7Projectiles[i].x-boss.x;
                    var y_circle = a7Projectiles[i].y-boss.y;
                    var radio = a7Projectiles[i].radio;

                    for (let l=0, j = polygon.length -1; l < polygon.length && !founded; j = l++) {

                        if ( Collider2D.detector.lineToCircle(polygon[l][0],polygon[l][1], polygon[j][0],polygon[j][1], x_circle,y_circle,radio)) {
                            x1 = polygon[l][0];
                            y1 = polygon[l][1];
                            x2 = polygon[j][0];
                            y2 = polygon[j][1];
                            founded = true;
                        }
                    }

                    if(founded){
                        var u = a7Projectiles[i].direction;
                        var v = new Vector2D(x2 - x1, y2 - y1);
                        var vectorRebound = Vector2D.getReboundVector(u,v);
                        forceRebound.x += vectorRebound.x;
                        forceRebound.y += vectorRebound.y;
                        polygonDetections++;
                    }
                }
            }

            if (polygonDetections != 0) {
                a7Projectiles[i].direction = forceRebound;
                a7Projectiles[i].rebounds++;                
            }

            if(a7Projectiles[i]!= null && a7Projectiles[i].rebounds > 20){
                destroyA7Projectile(a7Projectiles[i]);
                a7Projectiles.destroy( i );
            }
            
            if(a7Projectiles[i]!= null && new Vector2D(pj.x-a7Projectiles[i].x,pj.y-a7Projectiles[i].y).getMagnitude() > distance_to_destroy ){
                destroyA7Projectile(a7Projectiles[i]);
                a7Projectiles.destroy( i );
            }

        }
          
    }

    //SHIELD CAPTION
    if (pj.shield_active){
        for (let i = 0; i < enemiesAway.length; i++) {
         
            if(enemiesAway[i]!= null && Collider2D.detector.circleToPolygon( enemiesAway[i].x, enemiesAway[i].y, enemiesAway[i].radio, pj.shield_on_draw )){
              
              pj.holding.addObj({
                x: Math.random()* (55 - 27) + 27,
                y: Math.random()* (30 - 10) + 10
              });
              
              
              enemiesAway.destroy(i);
    
            }
        }

        for (let i = 0; i < a7Projectiles.length; i++) {            
         
            if(a7Projectiles[i]!= null && Collider2D.detector.circleToPolygon( a7Projectiles[i].x, a7Projectiles[i].y, a7Projectiles[i].radio*2, pj.shield_on_draw )){
              
              pj.holding.addObj({
                x: Math.random()* (55 - 17) + 17,
                y: Math.random()* (20 - 10) + 10
              });
              
              destroyA7Projectile(a7Projectiles[i],true);
              a7Projectiles.destroy(i);


            }
        }
        
    }

}