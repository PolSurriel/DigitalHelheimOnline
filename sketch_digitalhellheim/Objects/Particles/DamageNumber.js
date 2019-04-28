class DamageNumber{

    critic;
    number;
    size = 100;

    wiggle;

    opacity = 0;
    spawned = false;

    isWarning = false;

    constructor(x,y,number, isCritic,isWarning){
        this.isWarning = isWarning;
        this.critic = isCritic;
        this.x = x;
        this.y = y;
        this.number= number;

        this.wiggle = new Wiggle(0,0,0);
        this.wiggle.speed = 10;

        if (this.isCritic) this.size = 50;
        else if (!isWarning) this.size = 30;

    }

    update(){

        this.wiggle.update();

        if (this.spawned){
            this.opacity -= UMI.getSpeed(500);
            if (this.opacity <= 0){
                damagenumbers.destroy(this.index_in_main_array);
            }

        }else{
            this.opacity += UMI.getSpeed(600);
            if( this.opacity > 255 ){
                this.spawned = true;
                this.opacity = 400;
            } 

        }

    }

    draw(){
        noStroke();
        if(this.isWarning) fill(255,0,0,this.opacity);
        else if(this.critic) fill(255,255,0,this.opacity);
        else fill(255,255,255,this.opacity);

        textSize(UMI.toPixel(this.size));
        text(this.number, UMI.toPixel(Camera.translationX(this.x+this.wiggle.x)), UMI.toPixel(Camera.translationY(this.y+this.wiggle.y)));


    }

}