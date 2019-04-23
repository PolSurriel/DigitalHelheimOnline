class DamageNumber{

    critic;
    number;
    size;

    constructor(x,y,number,isCritic){
        this.critic = isCritic;
        this.x = x;
        this.y = y;
        this.number= number;

    }

    update(){



    }

    draw(){
        noStroke();
        if(this.critic)fill(255,255,0,255);
        else fill(255,255,255,255);

        textSize(UMI.toPixel(this.size));
        text(this.number, UMI.toPixel(Camera.translationX(this.x)), UMI.toPixel(Camera.translationY(this.y)));

    }




}