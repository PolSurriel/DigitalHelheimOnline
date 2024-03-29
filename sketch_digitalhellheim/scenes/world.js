
function world_setup(){
    if(room_music.playing()) room_music.stop();

    music.loop();
    cameraReference = new FollowerReference(pj);
    Camera.setObjectReference(cameraReference);
    

    pj.portal_opened = true;
    pj.portal_x = -60;
    pj.portal_y = 0;

    pj.z = 0;
    pj.y = 0;
    pj.x = 0;
    
    particles.setAllNull();
    pj.fixedParticles.setAllNull();

}

//gameloop
function world_gameloop(){
    
    world_update();
    world_draw();
  
}

//UPDATE
function world_update(){

    
    
    //hexagons collisions


    var tries = 0;
    while(hexagons.added < 15 && tries < 50){

        var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
        var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);


        var positionValid = true;
        for (let i = 0; i < hexagons.length && positionValid; i++) {
            if(hexagons[i] != null) positionValid = ( Math.abs(hexagons[i].x - x_on_create) > 100 && Math.abs(hexagons[i].y - y_on_create) > 100 )
        }
        if(positionValid &&  Math.abs(pj.x - x_on_create) > 100 && Math.abs(pj.y - y_on_create) > 100) {
            new Hexagon(x_on_create,y_on_create, create_hexagon(x_on_create,y_on_create) );
        }

        tries ++;
        
    }

    



    update_all();
    hexagon_collisions();
    chispas_menu.update();

    //PJ COLISIONS
    if(!pj.jumping){


        //ENEMIES
        for (let i = 0; i < enemies.length; i++) {
            
            if( !pj.jumping && enemies[i]!= null && Collider2D.detector.circleToCircle(pj.x,pj.y,enemies[i].x,enemies[i].y,pj.radio,enemies[i].radio) ){
                check_game_over();
                enemies.destroy(i);
            }
        }

      }


      //PROJECTILES COLISION

      for (let i = 0; i < projectiles.length; i++) {

       
        if(projectiles[i] != null){
            if(!pj.jumping && Collider2D.detector.circleToCircle( pj.x, pj.y,projectiles[i].x, projectiles[i].y, pj.radio,projectiles[i].radio ) ){
                check_game_over();
                
                projectiles.destroy(i);
            }

            for (let j = 0; j < enemies.length; j++) {
            
                if(enemies[j] != null && projectiles[i] != null && Collider2D.detector.circleToCircle(projectiles[i].x,projectiles[i].y,enemies[j].x,enemies[j].y,projectiles[i].radio,enemies[j].radio) ){
                    enemies.destroy(j)
                    
                    projectiles.destroy(i);

                    score += 100;

                }
            }

            for (let j = 0; j < enemiesLines.length; j++) {
                if( enemiesLines[j] != null && projectiles[i] != null  && Collider2D.detector.circleToCircle(projectiles[i].x,projectiles[i].y,enemiesLines[j].x,enemiesLines[j].y,projectiles[i].radio*2.3,enemiesLines[j].radio) ){
                    enemiesLines.destroy(j);
                    projectiles.destroy(i);

                    score += 150;

                }
            }

            for (let j = 0; j < enemiesProjectiles.length; j++) {
                if(enemiesProjectiles[j] != null && projectiles[i] != null  && projectiles[i].destroyEnemy && Collider2D.detector.circleToCircle(projectiles[i].x,projectiles[i].y,enemiesProjectiles[j].x,enemiesProjectiles[j].y,projectiles[i].radio*2,enemiesProjectiles[j].radio) ){
                    enemiesProjectiles.destroy(j);
                    projectiles.destroy(i);

                    score += 120;

                }
            }

            for (let j = 0; j < enemiesWaves.length; j++) {
                if(enemiesWaves[j] != null && projectiles[i] != null  && Collider2D.detector.circleToCircle(projectiles[i].x,projectiles[i].y,enemiesWaves[j].x,enemiesWaves[j].y,projectiles[i].radio,enemiesWaves[j].radio) ){
                    enemiesWaves.destroy(j);
                projectiles.destroy(i);

                score += 120;

                }
            }
            
            for (let j = 0; j < hexagons.length; j++) {
                if(hexagons[j] != null && projectiles[i] != null && Collider2D.detector.pointToCircle(projectiles[i].x, projectiles[i].y, hexagons[j].x, hexagons[j].y, 180)  && Collider2D.detector.circleToPolygon( projectiles[i].x, projectiles[i].y, projectiles[i].radio,hexagons[j].poly ) ){
                    
                    var founded = false;
                    var x1,y1;
                    var x2,y2;

                    var polygon = hexagons[j].poly;
                    var x_circle = projectiles[i].x;
                    var y_circle = projectiles[i].y;
                    var radio = projectiles[i].radio;

                    for (let i=0, j = polygon.length -1; i < polygon.length && !founded; j = i++) {

                        if ( Collider2D.detector.lineToCircle(polygon[i][0],polygon[i][1], polygon[j][0],polygon[j][1], x_circle,y_circle,radio)) {
                            x1 = polygon[i][0];
                            y1 = polygon[i][1];
                            x2 = polygon[j][0];
                            y2 = polygon[j][1];
                            founded = true;
                        }
                    }

                    var u = projectiles[i].direction;
                    var v = new Vector2D(x2 - x1, y2 - y1);
                    projectiles[i].direction = Vector2D.getReboundVector(u,v);
                    projectiles[i].rebounds++;
                }


                

            }

        }
          
      }



      for (let i = 0; i < linesShoot.length; i++) {
       if(linesShoot[i] != null){

            if(!pj.jumping && Collider2D.detector.pointToCircle(pj.x,pj.y,linesShoot[i].x,linesShoot[i].y,20)
                && Collider2D.detector.circleToLine( pj.x, pj.y, pj.radio*1.4, linesShoot[i].x, linesShoot[i].y,
                linesShoot[i].x+linesShoot[i].direction.x*linesShoot[i].size, linesShoot[i].y+linesShoot[i].direction.y*linesShoot[i].size ) ){
                check_game_over();
                linesShoot.destroy(i);
            }

            if(linesShoot[i]!=null && new Vector2D(pj.x-linesShoot[i].x,pj.y-linesShoot[i].y).getMagnitude() > distance_to_destroy ){
                linesShoot.destroy( i );
            }

            for (let j = 0; j < hexagons.length; j++) {
        
                if(linesShoot[i] != null && hexagons[j] != null && Collider2D.detector.pointToCircle(linesShoot[i].x,linesShoot[i].y, hexagons[j].x, hexagons[j].y, 180) && Collider2D.detector.circleToPolygon( linesShoot[i].x, linesShoot[i].y, 3,hexagons[j].poly ) ){
                    linesShoot.destroy(i);
                }

            }
        }

          
      }

      
      for (let i = 0; i < waves.length; i++) {
        if(waves[i] != null && !pj.jumping && Collider2D.detector.circleToLine( pj.x, pj.y, pj.radio, waves[i].x1, waves[i].y1,waves[i].x2, waves[i].y2 ) ){
            check_game_over();
            waves.destroy(i);
        }

      }
  
  
  

        
      if(pj.portal_opened && Collider2D.detector.circleToRect(pj.x,pj.y,pj.radio,pj.portal_x,pj.portal_y,30,40) ){
        
        goToRoom();
    }

    if(pj.portal_opened && Math.abs(pj.x - pj.portal_x) > 1500 ||  Math.abs(pj.y - pj.portal_y) > 1500 ){
        pj.portal_opened = false;
        
        
    }


    if(!pj.portal_opened){
        
            pj.portal_opened = true;
            
            var positionValid = false;
            var tries = 0;
            while(!positionValid && tries <= 50){
                tries ++;
                
                var x_on_create = Math.random() * ((500) - (400)) + (400);
                var y_on_create = Math.random() * ((500) - (400)) + (400);

                x_on_create *= (Math.floor(Math.random() * (100)) % 2 == 1 ) ? 1: -1;
                y_on_create *= (Math.floor(Math.random() * (100)) % 2 == 1 ) ? 1: -1;
                    x_on_create += pj.x;
                    y_on_create += pj.y;    
                
                positionValid = true;
                
                for (let i = 0; i < hexagons.length && positionValid; i++) {
                    if (hexagons[i]) positionValid = ( Math.abs(hexagons[i].x - x_on_create) > 300 || Math.abs(hexagons[i].y - y_on_create) > 300 );
                
                }   
            }
            
            pj.portal_x = x_on_create;
            pj.portal_y = y_on_create;


    
        
    }

        


      //SHIELD CAPTION
      if (pj.shield_active){
        for (let i = 0; i < enemiesAway.length; i++) {
         
            if(enemiesAway[i]!= null && Collider2D.detector.circleToPolygon( enemiesAway[i].x, enemiesAway[i].y, enemiesAway[i].radio, pj.shield_on_draw )){
              
              pj.holding.addObj({
                x: Math.random()* (55 - 27) + 27,
                y: Math.random()* (30 - 10) + 10
              });
              
              if(pj.pu_doubleproj_caught){
                  pj.holding.addObj({
                    x: Math.random()* (55 - 27) + 27,
                    y: Math.random()* (30 - 10) + 10
                  });
              }
              hunted++;
              score += 20;
              enemiesAway.destroy(i);

              
    
            }
          }

          for (let i = 0; i < projectiles.length; i++) {

         
    
            if(projectiles[i]!= null && projectiles[i].rebounds > 3){
                projectiles.destroy( i );
            }
            
            if(projectiles[i]!= null && new Vector2D(pj.x-projectiles[i].x,pj.y-projectiles[i].y).getMagnitude() > distance_to_destroy ){
                projectiles.destroy( i );
            }


            
            
         
            if(projectiles[i]!= null && Collider2D.detector.circleToPolygon( projectiles[i].x, projectiles[i].y, projectiles[i].radio*2, pj.shield_on_draw )){
              
              pj.holding.addObj({
                x: Math.random()* (55 - 17) + 17,
                y: Math.random()* (20 - 10) + 10
              });
              
              if(pj.pu_doubleproj_caught){
                  pj.holding.addObj({
                      x: Math.random()* (55 - 17) + 17,
                      y: Math.random()* (20 - 10) + 10
                  });
              }

  
              score += 100;
              projectiles.destroy(i);

              
      
    
            }
          }
        
      }
  
      
    if(dificultad == 1){
        generar_enemigos(5,65,1,1,1);

    }else if(dificultad == 2){
        generar_enemigos(10,65,2,1,2);

    }else if(dificultad == 3){ 
        generar_enemigos(15,65,3,2,2);

    }

    if(Math.floor((Math.random() * 450) + 1) == 1){
        cameraReference.random_zoom_transition();
        
    }

}

//DRAW
function world_draw(){




    translate(width/2,height/2);
    //scale(Camera.zoom);

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


    
    if(pj.portal_opened){
        image(stairs_2,UMI.toPixel( Camera.translationX(pj.portal_x) ),UMI.toPixel( Camera.translationY(pj.portal_y)), UMI.toPixel(40),UMI.toPixel(40));
        fill(255);
        noStroke();
        textSize(2*UMI.toPixel(12));
        textAlign(CENTER, CENTER);  
        text('Go home', UMI.toPixel(Camera.translationX(portal_X)), UMI.toPixel(Camera.translationY(portal_y)));
    
    }

    draw_all();
    enemiesAway.draw();

    

    
    drawingContext.shadowBlur = 50;
    drawingContext.shadowColor = "orange";
    
    fill('red');
    textAlign(RIGHT);
    noStroke();
    textSize(2*UMI.toPixel(40));
    text('x'+score+'    ',window.innerWidth/2,-window.innerHeight/2.2);


    drawingContext.shadowBlur = 0;

    Cursor.draw();


    fill(255,255,255,100);
    textAlign(RIGHT);
    noStroke();
    textSize(2*10);
    text('DigitalHelheim - ENTI-UB AA2 Algebra 1ro CDI Grupo A (Mananas) / Alumnos: Pol Surriel y Eric Garcia',window.innerWidth/2.02,-window.innerHeight/2.05);

}




function generar_enemigos(n,na,np,nl, nw){

    
    if(enemies.added < n){

        if(Math.floor((Math.random() * 100) + 1) == 1){

            var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
            var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);

            var distX = Math.abs(x_on_create-pj.x);
            var distY = Math.abs(y_on_create-pj.y);

            if(distX > 200 && distY > 200){
                enemies.addObj(new Enemy(x_on_create, y_on_create));
                
            } 
        }
    }

    if(enemiesAway.added < na){

        if(Math.floor((Math.random() * 5) + 1) == 1){

            var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
            var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);
            
        
            var distX = Math.abs(x_on_create-pj.x);
            var distY = Math.abs(y_on_create-pj.y);

            if(distX > 200 && distY > 200){
                enemiesAway.addObj(new EnemyAway(x_on_create, y_on_create));
            } 
        }
    }

    if(enemiesProjectiles.added < np){

        if(Math.floor((Math.random() * 50) + 1) == 1){

            var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
            var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);
            
           var distX = Math.abs(x_on_create-pj.x);
            var distY = Math.abs(y_on_create-pj.y);
            
            if(distX > 200 && distY > 200){
                enemiesProjectiles.addObj(new EnemyProjectile(x_on_create, y_on_create));
            } 
        }
    }

    if(enemiesLines.added < nl){

        if(Math.floor((Math.random() * 50) + 1) == 1){

            var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
            var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);
            
            var distX = Math.abs(x_on_create-pj.x);
            var distY = Math.abs(y_on_create-pj.y);
            
            if(distX > 200 && distY > 200){
                enemiesLines.addObj(new EnemyLine(x_on_create, y_on_create));
            } 
        }
    }

    if(enemiesWaves.added < nw){

        if(Math.floor((Math.random() * 50) + 1) == 1){

            var x_on_create = Math.random() * ((pj.x+500) - (pj.x-500)) + (pj.x-500);
            var y_on_create = Math.random() * ((pj.y+500) - (pj.y-500)) + (pj.y-500);
            
           var distX = Math.abs(x_on_create-pj.x);
            var distY = Math.abs(y_on_create-pj.y);
            
            if(distX > 200 && distY > 200){
                enemiesWaves.addObj(new EnemyWave(x_on_create, y_on_create));
            } 
        }
    }


}

function hexagon_collisions(){
    var isTrue = false;
    var colPoints = new Array();

    
    /* COLISION PUNTO POR PUNTO
    var AB = new Vector2D(pj.lighting.point2.x - pj.lighting.point1.x, pj.lighting.point2.y - pj.lighting.point1.y);
    var magnitude = AB.getMagnitude();
    var increment = magnitude / pj.lighting.len_points;
    AB.convertToUnitary();
    */

   var vp = new Vector2D(-(pj.lighting.point2.y - pj.lighting.point1.y), pj.lighting.point2.x - pj.lighting.point1.x).getUnitaryVector();


   var enemiesChecking = [ enemies, enemiesLines, enemiesProjectiles, enemiesWaves];
   if(pj.shooting){
        for (let e = 0; e < enemiesChecking.length; e++) {
            for (let i = 0; i < enemiesChecking[e].length; i++) {
                if (enemiesChecking[e][i] != null ){
                    if(Collider2D.detector.lineToCircle( pj.lighting.point1.x,pj.lighting.point1.y, pj.lighting.point2.x,pj.lighting.point2.y, enemiesChecking[e][i].x, enemiesChecking[e][i].y, enemiesChecking[e][i].radio )){
                        var info = Collider2D.reaction.pointToCircle(pj.x,pj.y, enemiesChecking[e][i].x, enemiesChecking[e][i].y, enemiesChecking[e][i].radio);
                        
                        info.line = {};
                        info.line.p1 = info;
                        info.line.p2 = new Vector2D(info.x+vp.x*2, info.y+vp.y*2);
                        isTrue = true;
                        info.isEnemy = true;
                        info.enemyIndex = [e , i];
                        colPoints.push(info);
                    }else {

                        var maxScal = 20;
                        var test1;
                        for (let scal = 1; scal < maxScal && !test1; scal+=3) {
                            test1 = Collider2D.detector.lineToCircle(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                                                    pj.lighting.point2.x,pj.lighting.point2.y,enemiesChecking[e][i].x, enemiesChecking[e][i].y, enemiesChecking[e][i].radio  );

                            if (!test1){
                                vp.x = -vp.x;
                                vp.y = -vp.y;
                                test1 = Collider2D.detector.lineToCircle(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                    pj.lighting.point2.x,pj.lighting.point2.y,enemiesChecking[e][i].x, enemiesChecking[e][i].y, enemiesChecking[e][i].radio  );
                            }

                        }

                        if(test1){
                            var info = Collider2D.reaction.pointToCircle(pj.x,pj.y, enemiesChecking[e][i].x, enemiesChecking[e][i].y, enemiesChecking[e][i].radio);
                            
                            info.line = {};
                            info.line.p1 = info;
                            info.line.p2 = new Vector2D(info.x+vp.x*2, info.y+vp.y*2);
                            isTrue = true;
                            info.isEnemy = true;
                            info.enemyIndex = [e , i];
                            colPoints.push(info);
                        }
                    }           
                }
            }
        }
    }
    

    for (let i = 0; i < hexagons.length; i++) {
        
        if(pj.shooting && hexagons[i] != null){

            /* COLISION PUNTO POR PUNTO
            var x1 = pj.lighting.point1.x;
            var y1 = pj.lighting.point1.y;
            var x2 = pj.lighting.point1.x+ AB.x*increment;
            var y2 = pj.lighting.point1.y+ AB.y*increment;
            for (let u = 0; u < pj.lighting.midPoints.length-1; u++) {
                var test = Collider2D.detector.lineToPolygon(x1+pj.lighting.midPoints[u].x,
                                                             y1+pj.lighting.midPoints[u].y,
                                                             x2+pj.lighting.midPoints[u+1].x,
                                                             y2+pj.lighting.midPoints[u+1].y,
                                                             hexagons[i].poly );

                if(test.isTrue){
                    isTrue = true;
                    for (let p = 0; p < test.info.length; p++) {
                        colPoints.push(test.info[p]);
                    }
                    
                }

                x1 += AB.x*increment;
                y1 += AB.y*increment;
                x2 += AB.x*increment;
                y2 += AB.y*increment;

            }*/

            
            //vector paralelo
            var vp = new Vector2D(-(pj.lighting.point2.y - pj.lighting.point1.y), pj.lighting.point2.x - pj.lighting.point1.x).getUnitaryVector();
            

            var test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x,pj.lighting.point1.y, pj.lighting.point2.x,pj.lighting.point2.y,hexagons[i].poly );
            if (!test.isTrue){
                
                var maxScal = 50;
                for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                    test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                                             pj.lighting.point2.x,pj.lighting.point2.y,hexagons[i].poly );
                }

                if (!test.isTrue){
                    vp.x = -vp.x;
                    vp.y = -vp.y;
                    for (let scal = 1; scal < maxScal && !test.isTrue; scal+=3) {
                        test = Collider2D.detector.lineToPolygon(pj.lighting.point1.x+vp.x*scal,pj.lighting.point1.y+vp.y*scal, 
                                                                 pj.lighting.point2.x,pj.lighting.point2.y,hexagons[i].poly );
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



        if(hexagons[i] != null && new Vector2D(pj.x-hexagons[i].x,pj.y-hexagons[i].y).getMagnitude() > distance_to_destroy ){
            hexagons.destroy( i );
        }

        if(hexagons[i] != null){
        var dist = new Vector2D(pj.x-hexagons[i].x,pj.y-hexagons[i].y).getMagnitude();
        if(dist < 170 && Collider2D.detector.circleToPolygon(pj.x,pj.y,pj.radio*2,hexagons[i].poly) ){
            var newPos = Collider2D.reaction.circleToPolygon(pj.last_x,pj.last_y,  pj.x,pj.y,pj.radio*2,hexagons[i].poly);

            if(!isNaN(newPos.x)){
                pj.x = newPos.x;
                pj.y = newPos.y;
            
            }else{
                pj.x = pj.last_x;
                pj.y = pj.last_y;
            }
            
        }


        for (let j = 0; j < enemies.length; j++) {
            if(enemies[j] != null){

                dist = new Vector2D(enemies[j].x-hexagons[i].x,enemies[j].y-hexagons[i].y).getMagnitude();
                if(dist < 170 && Collider2D.detector.circleToPolygon(enemies[j].x,enemies[j].y,enemies[j].radio,hexagons[i].poly) ){
                    var newPos = Collider2D.reaction.circleToPolygon(enemies[j].last_x,enemies[j].last_y,  enemies[j].x,enemies[j].y,enemies[j].radio,hexagons[i].poly);
        
                    if(!isNaN(newPos.x)){
                        enemies[j].x = newPos.x;
                        enemies[j].y = newPos.y;
                    
                    }else{
                        //enemies[j].x = enemies[j].last_x;
                        //enemies[j].y = enemies[j].last_y;
                    }
                    
                }

                if( new Vector2D(pj.x-enemies[j].x,pj.y-enemies[j].y).getMagnitude() > distance_to_destroy ){
                    enemies.destroy( j );
                }
            }
            
        }

        for (let j = 0; j < enemiesLines.length; j++) {
            
            if(enemiesLines[j] != null){
                dist = new Vector2D(enemiesLines[j].x-hexagons[i].x,enemiesLines[j].y-hexagons[i].y).getMagnitude();
                if(dist < 170 && Collider2D.detector.circleToPolygon(enemiesLines[j].x,enemiesLines[j].y,enemiesLines[j].radio,hexagons[i].poly) ){
                    var newPos = Collider2D.reaction.circleToPolygon(enemiesLines[j].last_x,enemiesLines[j].last_y,  enemiesLines[j].x,enemiesLines[j].y,enemiesLines[j].radio,hexagons[i].poly);
        
                    if(!isNaN(newPos.x)){
                        enemiesLines[j].x = newPos.x;
                        enemiesLines[j].y = newPos.y;
                    
                    }else{
                        //enemiesLines[j].x = enemiesLines[j].last_x;
                        //enemiesLines[j].y = enemiesLines[j].last_y;
                    }
                    
                }
            }
            
        }

        for (let j = 0; j < enemiesAway.length; j++) {
            if(enemiesAway[j] != null){
                
                dist = new Vector2D(enemiesAway[j].x-hexagons[i].x,enemiesAway[j].y-hexagons[i].y).getMagnitude();
                if(dist < 170 && Collider2D.detector.circleToPolygon(enemiesAway[j].x,enemiesAway[j].y,enemiesAway[j].radio,hexagons[i].poly) ){
                    var newPos = Collider2D.reaction.circleToPolygon(enemiesAway[j].last_x,enemiesAway[j].last_y,  enemiesAway[j].x,enemiesAway[j].y,enemiesAway[j].radio,hexagons[i].poly);
        
                    if(!isNaN(newPos.x)){
                        enemiesAway[j].x = newPos.x;
                        enemiesAway[j].y = newPos.y;
                    
                    }else{
                        //enemiesAway[j].x = enemiesAway[j].last_x;
                        //enemiesAway[j].y = enemiesAway[j].last_y;
                    }
                    
                }
            }
            
        }

        for (let j = 0; j < enemiesProjectiles.length; j++) {
            
            if(enemiesProjectiles[j] != null){

                dist = new Vector2D(enemiesProjectiles[j].x-hexagons[i].x,enemiesProjectiles[j].y-hexagons[i].y).getMagnitude();
                if(dist < 190 && Collider2D.detector.circleToPolygon(enemiesProjectiles[j].x,enemiesProjectiles[j].y,enemiesProjectiles[j].radio,hexagons[i].poly) ){
                    var newPos = Collider2D.reaction.circleToPolygon(enemiesProjectiles[j].last_x,enemiesProjectiles[j].last_y,  enemiesProjectiles[j].x,enemiesProjectiles[j].y,enemiesProjectiles[j].radio,hexagons[i].poly);
        
                    if(!isNaN(newPos.x)){
                        enemiesProjectiles[j].x = newPos.x;
                        enemiesProjectiles[j].y = newPos.y;
                    
                    }else{
                        //enemiesProjectiles[j].x = enemiesProjectiles[j].last_x;
                        //enemiesProjectiles[j].y = enemiesProjectiles[j].last_y;
                    }
                    
                }
                
            }
        }

        for (let j = 0; j < enemiesWaves.length; j++) {
            
            if(enemiesWaves[j] != null){

                dist = new Vector2D(enemiesWaves[j].x-hexagons[i].x,enemiesWaves[j].y-hexagons[i].y).getMagnitude();
                if(dist < 190 && Collider2D.detector.circleToPolygon(enemiesWaves[j].x,enemiesWaves[j].y,enemiesWaves[j].radio,hexagons[i].poly) ){
                    var newPos = Collider2D.reaction.circleToPolygon(enemiesWaves[j].last_x,enemiesWaves[j].last_y,  enemiesWaves[j].x,enemiesWaves[j].y,enemiesWaves[j].radio,hexagons[i].poly);
        
                    if(!isNaN(newPos.x)){
                        enemiesWaves[j].x = newPos.x;
                        enemiesWaves[j].y = newPos.y;
                    
                    }else{
                        //enemiesWaves[j].x = enemiesProjectiles[j].last_x;
                        //enemiesWaves[j].y = enemiesProjectiles[j].last_y;
                    }
                    
                }
                
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
                if(colPoints[p].isEnemy){
                    point.isEnemy = true;
                    point.enemyIndex = colPoints[p].enemyIndex;

                }else {
                    point.isEnemy = false;
                }
            }
        }

        if(point.isEnemy){
            enemiesChecking[point.enemyIndex[0]][point.enemyIndex[1]].damage();
        }

        pj.lighting.point2.x = point.x;
        pj.lighting.point2.y = point.y;
        
        
        if (chispas_menu.added < 30){
    
            var vector2 = new Vector2D((pj.lighting.point1.x-pj.lighting.point2.x), pj.lighting.point1.y-pj.lighting.point2.y).getUnitaryVector();
            vector2.rotate(Math.random() *3 -2);
            
            chispas_menu.addObj( new Chispa(point.x, point.y, vector2, false, true) );
            quemaduras.addObj( new Quemadura(point.x, point.y, new Vector2D(point.line.p2.x -point.line.p1.x, point.line.p2.y -point.line.p1.y).getAngle() ) );
            
        } 

    }
}

function check_game_over(){
    if(pj.health == 1){
        
        game_over = true;
        goToRoom();
        score = 0;

    }else{
        pj.health--;
    }
}

function goToRoom(){

    on_world = false;

    destroy_all();
    room_setup();

}




