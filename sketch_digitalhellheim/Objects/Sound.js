class Sound {

    src;
    isPlaying = false;
    volume;

    looping = false;

    constructor(src, volume){
        this.src = new Audio(src);
        this.src.volume = 0;
        this.volume = volume;
        this.src.loop = true;
        toPlayOnUserInteraction.push(this.src);
    }


    play(){
        stopAtFinal.addObj(this);
        this.src.volume = this.volume;
        this.src.currentTime = 0;
        this.isPlaying = true;

        setTimeout(() => {
            this.stop();
        }, this.src.duration*1000);
        
    }

    stop(){
        this.isPlaying = false;
        this.src.volume = 0;
        this.src.currentTime = 0;
        if(!this.looping) stopAtFinal.destroy(this.index_in_main_array);

    }

    playing(){
        return this.isPlaying;
    }

    loop(){
        this.isPlaying = true;
        this.src.volume = this.volume;
        this.src.currentTime = 0;
        this.looping = true;
    }

    end(){

    }

}