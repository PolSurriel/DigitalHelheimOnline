class Wiggle {

    direction;
    x;
    y;

    center_x;
    center_y;

    radio;

    speed;

    last_x;
    last_y;

    
    rotationCompt;
    last_rotation;

    constructor(x, y, radio){
        this.x = x;
        this.y = y;

        
        this.center_x = x;
        this.center_y = y;

        this.radio = radio;

        this.direction = new Vector2D(Math.random() * 10, Math.random() * 10).getUnitaryVector();

        this.last_rotation = 0;
        this.rotationCompt = Math.floor(Math.random()*180);

        this.speed = 10;

    }


    update(){

        if (this.rotationCompt > 0) {
            this.rotationCompt--;
        } else {
            var randomAngle = Math.random()*(PI/60)*2 - PI/60;
            this.last_rotation = UMI.getSpeed(randomAngle*60);
            this.rotationCompt = Math.floor(Math.random()*180);
        }

        var AB = new Vector2D (this.center_x-this.x, this.center_y-this.y);
        
        
        this.direction.rotate(this.last_rotation);
        
        this.x += this.direction.x*(UMI.getSpeed(this.speed));
        this.y += this.direction.y*(UMI.getSpeed(this.speed));
        
        var dist = AB.getMagnitude();
        AB = AB.getUnitaryVector();

        // print("x: "+this.x+"\ny: "+this.y+
        //     "\ndX> "+this.direction.x+
        //     "\ndY> "+this.direction.y+
        //     "\nABx> "+AB.x+
        //     "\nABy> "+AB.y+
        //     "\ndist: "+dist+
        //     "\nspeed: "+UMI.getSpeed(this.speed)
        //     );
        
        
        if(!isNaN(AB.x)){
            this.x += AB.x*(dist/20);
            this.y += AB.y*(dist/20);
        }


    }



}