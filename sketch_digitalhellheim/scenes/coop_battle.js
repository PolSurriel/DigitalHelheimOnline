function coop_battle_setup(){
    initSocket();
    window.onmousedown = online_playing_onmousedown; 
    window.onmouseup   = online_playing_onmouseup; 
    window.onkeydown   = online_playing_onkeydown; 
    window.onkeyup     = online_playing_onkeyup; 

    if(room_music.playing()) room_music.stop();

    cameraReference = new FollowerReference(pj);
    Camera.setObjectReference(cameraReference);
    

    pj.portal_opened = true;
    pj.portal_x = -60;
    pj.portal_y = 0;

    pj.z = 0;

    
    particles.setAllNull();
    pj.fixedParticles.setAllNull();


}

function coop_battle_update(){
    update_all();
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



    draw_all();

    Cursor.draw();

    fill(255,255,255,100);
    textAlign(RIGHT);
    noStroke();
    textSize(10);
    text('DigitalHelheim - ENTI-UB AA1 Álgebra 1º CDI Grupo A (Mañanas) / Alumnos: Pol Surriel y Eric Garcia',window.innerWidth/2.02,-window.innerHeight/2.05);

}

function coop_battle_gameloop(){
    coop_battle_update();
    coop_battle_draw();
}