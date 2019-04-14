Array.prototype.update = function (){
  for (let i = 0; i < this.length; i++) 
      if(this[i] != null) this[i].update();
}

Array.prototype.draw = function (){
  for (let i = 0; i < this.length; i++) 
      if(this[i] != null) this[i].draw();
}

Array.prototype.destroy = function (i){


  this.casillas_libres[this.ultima_casilla_por_escribir ++] = i;
  if(this.ultima_casilla_por_escribir  >= this.length) this.ultima_casilla_por_escribir  = 0;

  this[i] = null;
  this.added--;
}

Array.prototype.addObj = function (obj){

  this.ultima_casilla_libre++;
  if(this.ultima_casilla_libre >= this.length) this.ultima_casilla_libre = 0;
  
  this[this.casillas_libres[this.ultima_casilla_libre]] = obj;
  obj.index_in_main_array = this.casillas_libres[this.ultima_casilla_libre];
  
  this.added ++;
    
}

Array.prototype.setAllNull = function (){

  this.casillas_libres = new Array(this.length);
  this.ultima_casilla_libre = 0;
  this.ultima_casilla_por_escribir = 0;

  for (let i = 0; i < this.length; i++) {
      this[i] = null;
      this.casillas_libres[i] = i;
  }
  this.added = 0;
}

Array.prototype.added = 0;

var registrado = false;



var FPS_COUNT = 0;
var CURRENT_FPS = 60;


document.addEventListener('contextmenu', event => event.preventDefault());

var c;
var ctx;



// using UMI.js
var online_players = new Array(60);
var pj = new Player(-60, 0);
var cameraReference;
var score = 0;

var pu_1_w = new Wiggle(-210,80,1);
var pu_1_w_l2 = new Wiggle(-210,80,3);

var pu_2_w = new Wiggle(-18,80,1);
var pu_2_w_l2 = new Wiggle(-18,80,3);

var pu_3_w = new Wiggle(172,80,1);
var pu_3_w_l2 = new Wiggle(172,80,3);

var pu_4_w = new Wiggle(-120,180,1);
var pu_4_w_l2 = new Wiggle(-120,180,3);

var pu_5_w = new Wiggle(80,180,1);
var pu_5_w_l2 = new Wiggle(80,180,3);


// var poly = [[-10,10], [-30, 50], [40, 30], [55,31]];
var poly = [[-10,6], [-30, 50], [40, 30],[50, -10] ];

var hexagons = Array(30);
var enemies = new Array(60);
var enemiesAway = new Array(60);
var enemiesProjectiles = new Array(60);
var enemiesLines = new Array(60);
var projectiles = new Array(60);
var linesShoot = new Array(60);
var enemiesWaves = new Array(60);
var waves = new Array(60);
var particles = new Array(100);

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
particles.setAllNull();
online_players.setAllNull();


var pu_count = 0;
var hunted = 0;


var ball;

var dificultad = 1;

var game_over = false;
var game_over_speed;
var game_over_default_speed;
var game_over_status;

var hay_portal = false;
var portal_X;
var portal_y;


//Hexagons:
var hexagon_reference;
var hexagon_lado;
var hexagon_height;
var hex_reg_x = 1.5;
var hex_reg_y = 0.82;

//src's:
var chispa_sound;
var menu_music;
var music;
var room_music;
var bg;
var bg_room;
var bg_texture;
var stairs;
var power_up_speed_img_layer_1;
var power_up_speed_img_layer_2;
var power_up_duplicate_img_layer_1;
var power_up_duplicate_img_layer_2;
var power_up_health_img_layer_1;
var power_up_health_img_layer_2;
var power_up_random_img_layer_1;
var power_up_random_img_layer_2;
var power_up_shield_img_layer_1;
var power_up_shield_img_layer_2;
var throne_img;
var power_up_sound;
var button_red_img;
var stairs_2;



var world_gameloop_phase = 1;

var alone = false;

var display_controls = false;

var distance_to_destroy = 1000;

var font;
var font2;

var font_p;

var TIMES_NEW_ARIAL;
var PIXEL_ARIAL;

var chispa2_sound;
function preload() {

    font = loadFont('fuentes/fuente.ttf');
    font2 = loadFont('fuentes/fuente2.ttf');
    font_p = loadFont('https://fonts.gstatic.com/s/newscycle/v14/CSR54z1Qlv-GDxkbKVQ_dFsvWNRevA.ttf');

    TIMES_NEW_ARIAL = loadFont('fuentes/timesnewarial.ttf');
    PIXEL_ARIAL = loadFont('fuentes/PIXEARG_.ttf');


    chispa_sound = new Sound('./src/chispas.mp3', 0.02);
    chispa2_sound = new Sound('./src/chispas.mp3', 0.015);
    power_up_sound = new Sound('./src/get_power_up.mp3',1);
    menu_music = new Sound('./src/cancion_menu.wav',0.1); 
    music = new Sound('./src/disco-shmisco.mp3',0.5);
    room_music = new Sound('./src/room_music.mp3',0.5);;
    bg_room = loadImage('./src/bg_room_texture.png',100,100);
    pj.loadAssets();
    stairs = loadImage('./src/stairs.png');
    stairs_2 = loadImage('./src/stairs_2.png');
    power_up_speed_img_layer_1 = loadImage('./src/power_up_speed_layer_1.png');
    power_up_speed_img_layer_2 = loadImage('./src/power_up_speed_layer_2.png');
    power_up_duplicate_img_layer_1 = loadImage('./src/power_up_duplicate_layer_1.png'); 
    power_up_duplicate_img_layer_2 = loadImage('./src/power_up_duplicate_layer_2.png'); 
    power_up_health_img_layer_1 = loadImage('./src/power_up_health_layer_1.png');
    power_up_health_img_layer_2 = loadImage('./src/power_up_health_layer_2.png');
    throne_img = loadImage('./src/throne.png'); 
    bg_texture = loadImage('./src/bg_texture.png');

    power_up_random_img_layer_1= loadImage('./src/power_up_random_layer_1.png');
    power_up_random_img_layer_2= loadImage('./src/power_up_random_layer_2.png');
    power_up_shield_img_layer_1= loadImage('./src/power_up_shield_layer_1.png');
    power_up_shield_img_layer_2= loadImage('./src/power_up_shield_layer_2.png');

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


  


  var on_world = false;
  var on_coop_battle = false;

  var portal_abierto = false;

  var portal_x;
  var portal_y;