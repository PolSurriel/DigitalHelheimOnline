/*

No quisimos que la cámara siguiera al personaje porque entonces este se hubiera
visto todo el rato en el centro. Este efecto no nos gusta mucho para el tipo de 
gameplay que hemos implementado.

Se nos ocurrión que podíamos hacer un objeto que siguiera a otro objeto y este
tuviera un movimiento fluido con una velocidad. Para ello hicimos esta clase,
imaginándonos diferentes márgenes donde la velocidad de aproximación cambia.

De esta manera, cuanto más lejos se encuentra el jugador de este objeto,
más rápido se acerca a él. Simplemente usando una instancia de este objeto
como referencia para la cámara obtuvimos una camara que nos satisfajo al fin.

Sin embargo, tuvimos la idea de hacer zooms aleatorios. Por lo que añadimos un
método que aleatoriamente se llamaría desde el gameloop.

Siguiente lectura recomendada: UserEvents.js


*/


class FollowerReference {
    
    x;
    y;
    following;
    margin = 70;


    zoom_speed;
    last_zoom = 'negative';
    zoom_to_do;
    doing_zoom = false;
    zoom_state = 0;
    zoom_state_count = 0; 

    speed_d;

    constructor(obj){
        this.x = obj.x;
        this.y = obj.y;
        this.following = obj;

        //UMI.LogicObjects.push(this);
        this.speed_d = UMI.getSpeed(1);
    }

    random_zoom_transition(){
        this.zoom_speed = UMI.getSpeed(Math.floor(Math.random()*(90-41)+41));
        this.doing_zoom = true;
        this.zoom_state = 0;

        if(this.zoom_state_count >= -200 && this.last_zoom == 'negative' && this.zoom_state_count <= 200){
            this.last_zoom = 'positive';
            this.zoom_to_do = Math.floor(Math.random()*(100-41)+41);
        }else {
            this.zoom_to_do = Math.floor(Math.random()*(100-41)+41);
            this.last_zoom = 'negative';
       
            this.zoom_speed *= -1;
        }

        this.speed_d = this.zoom_speed/Math.floor(Math.random()*(200-70)+70) * (60/CURRENT_FPS);
    }



    update(){        

        

        if(this.doing_zoom){
            this.zoom_speed -= this.speed_d;

            Camera.zoom(this.zoom_speed);
            this.zoom_state += Math.abs(this.zoom_speed);

            if (this.last_zoom == 'positive'){
                if(this.zoom_speed <= 0){
                    this.zoom_state_count += this.zoom_state;
                    this.doing_zoom = false;
                }

            }else {
                if( this.zoom_speed >= 0){
                    this.zoom_state_count -= this.zoom_state;
                    this.doing_zoom = false;
                }
            }
            
        } else {
            this.speed_d = UMI.getSpeed(1);
        }


        //Acercarse hacia el personaje con una magnitud relativa 
        //a la distancia del personaje con el centro de la referencia
        
        
        var vectorToPlayer = [this.following.x-this.x,this.following.y-this.y];

        var magnitude = Math.sqrt(vectorToPlayer[0]*vectorToPlayer[0]+vectorToPlayer[1]*vectorToPlayer[1]);
        
        
        if(magnitude > this.margin){
            var unitaryVectorToPlayer = [vectorToPlayer[0]/magnitude, vectorToPlayer[1]/magnitude];

            this.x += UMI.getSpeed(unitaryVectorToPlayer[0]*(magnitude/2));
            this.y += UMI.getSpeed(unitaryVectorToPlayer[1]*(magnitude/2));
        
        } else if (magnitude > 0){
            var unitaryVectorToPlayer = [vectorToPlayer[0]/magnitude, vectorToPlayer[1]/magnitude];

            this.x += UMI.getSpeed(unitaryVectorToPlayer[0]*(magnitude/3));
            this.y += UMI.getSpeed(unitaryVectorToPlayer[1]*(magnitude/3));
        
        }

        if(!( this.x < Number.MAX_VALUE )) this.x = 0;
        if(!( this.y < Number.MAX_VALUE )) this.y = 0;
        if(this.x == Infinity ||this.x == -Infinity) this.x = 0;
        if(this.y == Infinity ||this.y == -Infinity) this.y = 0;

        

        
        
    }

    draw(){
        
        fill(0,0,0,0);
        stroke(255);
        ellipse(0, 0, UMI.toPixel(this.margin*2), UMI.toPixel(this.margin*2));

    }

}