class Cursor {

    static draw(){

        if(!isMobileDevice()){
            fill(50,50,50,255);
            ellipse(mouseX-windowWidth/2, mouseY-windowHeight/2, 15, 15);
            fill(150,10,10,255);
            ellipse(mouseX-windowWidth/2, mouseY-windowHeight/2, 10, 10);
        }
                
    }
}