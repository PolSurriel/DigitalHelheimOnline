
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

    pj.update();
    particles.update();

}

function draw_all(){

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
    hexagons.draw();
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
}