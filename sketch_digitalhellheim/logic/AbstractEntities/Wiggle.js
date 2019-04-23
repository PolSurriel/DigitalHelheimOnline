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

        this.direction = new Vector2D (Math.random() * 10, Math.random() * 10).getUnitaryVector();

        this.last_rotation = 0;
        this.rotationCompt = Math.floor(Math.random()*180);


        this.speed = UMI.getSpeed(10);

    }


    update(){

        this.last_x = this.x;
        this.last_y = this.y;

        if (this.rotationCompt > 0) {
            this.rotationCompt--;
        } else {
            var randomAngle = Math.random()*(Math.PI/60)*2 - PI/60;
            this.last_rotation = randomAngle;
            this.rotationCompt = Math.floor(Math.random()*180);
        }

        var AB = new Vector2D (this.center_x-this.x, this.center_y-this.y);
        
        
        this.direction.rotate(this.last_rotation);
        
        this.x += this.direction.x*(this.speed);
        this.y += this.direction.y*(this.speed);
        
        
        var dist = AB.getMagnitude();
        AB = AB.getUnitaryVector();
        
        
        if(!isNaN(AB.x)){
            this.x += AB.x*(dist/20);
            this.y += AB.y*(dist/20);

        }


    }



}