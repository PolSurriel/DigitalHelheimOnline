class Sound {

    src;
    playing = false;

    constructor(src, volume){
        this.src = new Audio(src);
        this.src.volume = volume;
    }


    play(){
        this.src.play();
        this.playing = true;
    }

    stop(){
        this.playing = false;
        this.src.pause();
        this.src.currentTime = 0;
    }

    playing(){
        return this.playing;
    }

    loop(){
        this.playing = true;
        this.src.loop = true
        this.src.play();
    }

    end(){

    }

}