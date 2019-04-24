
//All global variables are declared in variables_globales.js file

//SETUP
function setup(){

  //Crear ventana:
  createCanvas(windowWidth, windowHeight);
  //camera(width/2,height/2,(height/2) / tan(PI/6), width/2,height/2,0, 0,1,0);

  
  //camera(x,0,(height/2) / tan(PI/6), 0,0,0, 0,1,0);
  UMI.setup(); 

  register_setup();


  hexagon_reference = generate_hexagon_reference(-66.25, -18.8, 22, 6);

  hexagon_lado = Math.abs(hexagon_reference[5][0]-hexagon_reference[4][0]);
  hexagon_height = Math.abs(hexagon_reference[2][1]-hexagon_reference[4][1]);
  hexagon_width = Math.abs(hexagon_reference[0][0]-hexagon_reference[3][0]);

  console.log('VERSION ESTABLE 2.0');
    
/*
  document.getElementById('screen').innerHTML += `
    
      <div style="position:fixed; width:`+Math.floor(UMI.toPixel(10))+`px; height:`+Math.floor(UMI.toPixel(10))+`px; background-color:red;" >
      </div>
    
    `;


    */


    setInterval(() => {
      
      CURRENT_FPS = FPS_COUNT*10;
      FPS_COUNT = 0;

      // to debug
      // print("--------------------------|\t"+Math.abs(pj.x - pj.lastXSecond));      
      // pj.lastXSecond = pj.x;

    }, 100);

    
}



  //gameloop  
function draw(){ 

  

  if(!pause){
    if(!registrado) register_gameloop();
    else if (on_coop_battle) coop_battle_gameloop();
    else if (on_world) world_gameloop();
    else room_gameloop();
  }

  FPS_COUNT ++;

  // to debug
  // print(UMI.FPS+"\n"+CURRENT_FPS+"\n"+FPS_COUNT);

  textFont(PIXEL_ARIAL);
  textSize(10);
  text( CURRENT_FPS+'FPS' , -innerWidth/2+40, -innerHeight/2+10);

  
  

  



}











