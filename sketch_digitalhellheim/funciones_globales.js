
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    UMI.setup();

    display_li = false;

    
  }

  
  function createEnemies() {
    enemies.push(new Enemy(150, 150));
    enemiesAway.push(new EnemyAway(-150, 150));

  }



  function generate_hexagon_reference(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    
    var r = new Array();
    
    for (let a = 0; a < TWO_PI; a += angle) {
      r.push([
        x + cos(a) * radius,
        y + sin(a) * radius
      ]);
    }

    return r;

  }



  function update_all(){
    cameraReference.update();
    enemies.update();
    enemiesAway.update();
    enemiesWaves.update();
    enemiesLines.update();
    projectiles.update();
    hexagons.update();
    waves.update();
    linesShoot.update();
    enemiesProjectiles.update();
    
    online_players.update();
    quemaduras.update();

    pj.update();
    particles.update();

}

var in_host_mode = false;

function host_mode(){


  pj.update = function() {};
  pj.draw = function () {};
  pj.x = 9999;
  pj.y = 9999;
  sharePosition();
  pj.die = function () {};
  window.shareDeath = function() {};
  window.sharePosition = function () {};


  cameraReference.following = {x:boss.x, y:boss.y};
  shareimhost();

  in_host_mode= true;

  Camera.zoom(-400);

  window.onmousedown = () => {}; 
  window.onmouseup   = () => {}; 
  window.onkeydown   = () => {}; 
  window.onkeyup     = () => {}; 
  window.onmousemove = () => {};

}

function draw_all(){
    
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
    quemaduras.draw();
}

function destroy_all(){
    enemies.setAllNull();
    enemiesAway.setAllNull();
    enemiesProjectiles.setAllNull();
    enemiesLines.setAllNull();
    projectiles.setAllNull();
    linesShoot.setAllNull();
    enemies.setAllNull();
    enemiesWaves.setAllNull();
    waves.setAllNull();
    hexagons.setAllNull();
    enemiesProjectiles.setAllNull();
    particles.setAllNull();
    chispas_menu.setAllNull();
}

var testModeActive = false;
function testMode(){
  dificultad = 4;
  testModeActive = true;

  console.log(`
  
  With test mode activated enemies will not spawn if you don't choose a difficulty mode.
  
  Commands:

  -destroy_all() -> destroy all Objects (except the player).
  -score = 99999999
  -Enemies:
    +createEnemy()
    +createEnemyAway()
    +createEnemyWave()
    +createEnemyLine()
    +createEnemyProjectile()
  -Powe Up's:
    +getUnlimitedShield()
    +getSpeedx1dot5()
    +getDuplicateProjectiles()
    +getHealthx2()
    +getRandomChoice()
  -Camera.zoom(n/-n)
  
  Press 'P' to pause and resume the game execution.

  To change FPS press:
    '1' -> 10 fps
    '2' -> 20 fps
    '3' -> 30 fps
    '6' -> 60 fps
  
  Game pause is not available in online modes`);

  return "Use this tool to do some good. A great power carries a great responsibility.";
}

function createEnemy(){
  enemies.addObj(new Enemy(pj.x-300, pj.y));
}
function createEnemyAway(){
  enemiesAway.addObj(new EnemyAway(pj.x-300, pj.y));
}

function createEnemyWave(){
  enemiesWaves.addObj(new EnemyWave(pj.x-300, pj.y));
}

function createEnemyLine(){
  enemiesLines.addObj(new EnemyLine(pj.x-300, pj.y));
}

function createEnemyProjectile(){
  enemiesProjectiles.addObj(new EnemyProjectile(pj.x-300, pj.y));
}

function getUnlimitedShield(){
  pj.pu_shield_caught = true;

      pj.health = 2;
      pu_count++;
      power_up_sound.play();

}
function getSpeedx1dot5(){
  pj.pu_speed_caught = true;
  

  pj.speed *= 1.5;
  pu_count++;
  power_up_sound.play();

}
function getDuplicateProjectiles(){
  pj.pu_doubleproj_caught = true;


  pu_count++;
  power_up_sound.play();

}
function getHealthx2(){
  pj.pu_health_caught = true;
  
  pj.health = 2;
  pu_count++;
  power_up_sound.play();

}
function getRandomChoice(){
  pj.pu_random_caught = true;

  pj.health = 2;
  pu_count++;
  power_up_sound.play();

  var assigned = false;

  do{

      
      var val = Math.floor(Math.random() * (6));

      if(val == 1 && !pj.pu_doubleproj_caught){
          pj.pu_doubleproj_caught = true;
          assigned=true;
          
      }else if (val == 2 && !pj.pu_health_caught){
          pj.pu_health_caught = true;
          pj.health = 2;
          assigned=true;
          
      }else if (val == 3 && !pj.pu_speed_caught){
          pj.pu_speed_caught = true;
          pj.speed *= 1.5;
          assigned=true;
          
      }else if(!pj.pu_shield_caught){
          pj.pu_shield_caught = true;
          assigned=true;
      }
      
  }while(!assigned);

}




function create_hexagon(x, y){
        
  var i = Math.floor( (y/(hexagon_height)));
  var j = Math.floor( (x/(hexagon_width+hexagon_lado))); 

  var r = new Array();

  hexagon_reference.forEach(point => {
      r.push([
          point[0]+(hex_reg_x*j+(hexagon_width+hexagon_lado)*j),
          point[1]+(hex_reg_y*i+hexagon_height*i)
      ]);
  });


  return r;

}

function infinityCheck(value){
  return value == Infinity || value == -Infinity;
}