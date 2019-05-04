class Sound {

    src;

    constructor(src, volume){
        this.src = new Audio(src);
        this.src.setVolume(volume);
    }


    play(){
        this.src.play();
    }

    stop(){
        this.src.stop();
    }

    playing(){
        return this.src.isPlaying();
    }

    loop(){
        this.src.loop();
    }

    end(){

    }

}