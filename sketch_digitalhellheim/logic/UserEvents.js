/*
Dado que todavía no estamos formados, no sabíamos cómo implementar una gestión
de eventos de teclado cómoda en una marabunta de código como la que hemos acabado
creando. Basándonos en cómo Unity te permite acceder al estado del teclado,
hemos creado eventos y clases apartes que encapsulan esta información.

Hemos tenido que violar el acceso de algún atributo porque, por alguna
razón que no logramos comprender, al hacer un if con el estado de la tecla
nunca entraba.


En la clase Player comprobábamos si la tecla había sido soltada.
if(antes_pulsada == true && !KeyBoard.jump.pressed) pj.can_splash = true;


Siguiente lectura recomendada: Collider2D.js

*/


class Mouse {
    static left = {
        clicked:false
    };

    static right = {
        clicked:false
    };
}


class Keyboard {

    static left = {
        code:65,
        secondaryCode:37,
        pressed:false,

    };

    static right = {
        code:68,
        secondaryCode:39,
        pressed:false,

    };

    static top = {
        code:87,
        secondaryCode:38,
        pressed:false,

    };

    static bottom = {
        code:83,
        secondaryCode:40,
        pressed:false,

    };

    static jump = {
        code:32,
        secondaryCode:9999999,
        pressed:false,

    }

}

class TouchPad {

}



if(!isMobileDevice()){

    online_playing_onmousedown = function (e) {
        var tengoQEnviar;
        if((e.button == 0)){
             tengoQEnviar = !Mouse.left.clicked;
             Mouse.left.clicked = true;
        }else{
            tengoQEnviar = !Mouse.right.clicked;
            Mouse.right.clicked = true;

        } 
        if(tengoQEnviar){
            shareAction({
                type:(e.button == 0) ? 'mouseLeftClick': 'mouseRightClick',
                code:e.keyCode,
                down:true
            });
        }

    }

    online_playing_onmouseup = function (e) {
        var tengoQEnviar;
        if((e.button == 0)){
             tengoQEnviar = Mouse.left.clicked;
             Mouse.left.clicked = false;
        }else{
            tengoQEnviar = Mouse.right.clicked;
            Mouse.right.clicked = false;

        } 
        if(tengoQEnviar){
            shareAction({
                type:(e.button == 0) ? 'mouseLeftClick': 'mouseRightClick',
                code:e.keyCode,
                down:false
            });
        }
    }

    online_playing_onkeydown = function (e){

        var tengoQEnviar = false;

        switch(e.keyCode) {
            case Keyboard.left.code:
            case Keyboard.left.secondaryCode:
                tengoQEnviar = !Keyboard.left.pressed;
                Keyboard.left.pressed = true;
                break;

            case Keyboard.top.code:
            case Keyboard.top.secondaryCode:
                tengoQEnviar = !Keyboard.top.pressed;
                Keyboard.top.pressed = true;
                
                break;
            case Keyboard.right.code:
            case Keyboard.right.secondaryCode:
                tengoQEnviar = !Keyboard.right.pressed;
                Keyboard.right.pressed = true;
            
                break;
            case Keyboard.bottom.code:
            case Keyboard.bottom.secondaryCode:
                tengoQEnviar = !Keyboard.bottom.pressed;
                Keyboard.bottom.pressed = true;
                break;
            case Keyboard.jump.code:
                tengoQEnviar = !Keyboard.jump.pressed;
                Keyboard.jump.pressed = true;
                break;
        }

        if(tengoQEnviar){
            shareAction({
                type:'key',
                code:e.keyCode,
                down:true
            });
        }

        



    }

    online_playing_onkeyup = function (e){

        var tengoQEnviar = false;

        switch(e.keyCode) {
            case Keyboard.left.code:
            case Keyboard.left.secondaryCode:
                tengoQEnviar = Keyboard.left.pressed;
                Keyboard.left.pressed = false;
                break;

            case Keyboard.top.code:
            case Keyboard.top.secondaryCode:
                tengoQEnviar = Keyboard.top.pressed;
                Keyboard.top.pressed = false;
                
                break;
            case Keyboard.right.code:
            case Keyboard.right.secondaryCode:
                tengoQEnviar = Keyboard.right.pressed;
                Keyboard.right.pressed = false;
            
                break;
            case Keyboard.bottom.code:
            case Keyboard.bottom.secondaryCode:
                tengoQEnviar = Keyboard.bottom.pressed;
                Keyboard.bottom.pressed = false;
            
                break;
            case Keyboard.jump.code:
                tengoQEnviar = Keyboard.jump.pressed;
                pj.can_splash = true; //esto tiene sus razones
                Keyboard.jump.pressed = false;
                break;

        }
        if(tengoQEnviar){
            shareAction({
                type:'key',
                code:e.keyCode,
                down:false
            });
        }


    }

    online_playing_onmousemove = function(){
        
        shareAction({
            type:'mouseMov',
            vector:pj.mouse_vector
        });
    }


    playing_onmousedown = function (e) {

        if (e.button == 0)
            Mouse.left.clicked = true;
        else if (e.button == 2)
            Mouse.right.clicked = true;
    }

    playing_onmouseup = function (e) {
        if (e.button == 0)
            Mouse.left.clicked = false;
        else if (e.button == 2)
            Mouse.right.clicked = false;

    }

    playing_onkeydown = function (e){

        switch(e.keyCode) {
            case Keyboard.left.code:
            case Keyboard.left.secondaryCode:
                Keyboard.left.pressed = true;
                break;

            case Keyboard.top.code:
            case Keyboard.top.secondaryCode:
                Keyboard.top.pressed = true;
                
                break;
            case Keyboard.right.code:
            case Keyboard.right.secondaryCode:
                Keyboard.right.pressed = true;
            
                break;
            case Keyboard.bottom.code:
            case Keyboard.bottom.secondaryCode:
                Keyboard.bottom.pressed = true;
                break;
            case Keyboard.jump.code:
                Keyboard.jump.pressed = true;
                break;
        }


        if (testModeActive) {
            switch(e.keyCode) {
                case 80:
                    pause = !pause;
                    break;
                case 97:
                case 49:
                    console.log("Current FPS: "+10+" fps");
                    UMI.setFrameRate(10);
                    break;
                case 98:
                case 50:
                    console.log("Current FPS: "+20+" fps");
                    UMI.setFrameRate(20);
                    break;
                case 99:
                case 51:
                    console.log("Current FPS: "+30+" fps");
                    UMI.setFrameRate(30);
                    break;
                case 102:
                case 54:
                    console.log("Current FPS: "+60+" fps");
                    UMI.setFrameRate(60);
                    break;
            }
        }
    }

    playing_onkeyup = function (e){


        switch(e.keyCode) {
            case Keyboard.left.code:
            case Keyboard.left.secondaryCode:
                Keyboard.left.pressed = false;
                break;

            case Keyboard.top.code:
            case Keyboard.top.secondaryCode:
                Keyboard.top.pressed = false;
                
                break;
            case Keyboard.right.code:
            case Keyboard.right.secondaryCode:
                Keyboard.right.pressed = false;
            
                break;
            case Keyboard.bottom.code:
            case Keyboard.bottom.secondaryCode:
                Keyboard.bottom.pressed = false;
            
                break;
            case Keyboard.jump.code:
                pj.can_splash = true; //esto tiene sus razones
                Keyboard.jump.pressed = false;
                break;

        }
        

    }

    playing_onmousemove = function(){
        
    }




}else {

    function onJump (e){

    }

    function touchPadEvent (e){
        console.log(e.type);
    }




}