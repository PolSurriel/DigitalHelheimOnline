/*

Si queríamos hacer un buen juego necesitábamos trabajar con 
un sistema de reescalado y regulación de FPS. Por esa razón
creamos la clase estática UMI, de "Unidad de Medida Improvisada".

UMI es la clase que cotrola el "espacio-tiempo". Cuando la pantalla
es de 800 píxeles de alto, 1umi = 1px. A partir de esta equivalencia,
dando por hecho que todos los valores del programa están en umi's,
UMI traduce de umi's a px y de px a umi's.

Con este sistema tan simple sólo con manipular esta equivalencia
podemos hacer efectos de zoom, ya que si en una pantalla de 800
ahora un umi = 0.5 píxeles, se dibujará la mitad de grande.

En el caso de escalares de velocidad, lo que hace es dividir
la velocidad por el número de FPS. de manera que cuando queramos
incrementar un valor, este se incrementará de manera relativa
a la tasa de refresco.


A nosotros nos ha fascinado crear esta clase porque nos muestra 
cómo desde las lecciones más símples del Álgebra, las reglas de 3,
podemos hacer coasas impresionantes.

Siguiente archivo recomendado: Camera.js

*/

class UMI {

    static FPS = 60;

    static DEFAULT_UMI_UNIT_ON_PIXELS = 800;
    static UMI_UNIT_ON_PIXELS = this.DEFAULT_UMI_UNIT_ON_PIXELS;
    static UMIS_FOR_EACH_PIXEL;

    

    static setup(){
        this.UMIS_FOR_EACH_PIXEL = height/this.UMI_UNIT_ON_PIXELS;
        frameRate(this.FPS);
    }

    static toPixel(umis) {
        return umis*this.UMIS_FOR_EACH_PIXEL;
    }

    static toUMI(pixels){
        return pixels/this.UMIS_FOR_EACH_PIXEL;
    }

    static getSpeed(umi){
        return umi/CURRENT_FPS;
        // return umi/this.FPS;
    }

    static getDelay(umi){
        return umi*this.FPS;
    }

    static setFrameRate(fps){
        this.FPS = fps;
        frameRate(this.FPS);
    }

    static updateZoom(){
        this.UMIS_FOR_EACH_PIXEL = height/this.UMI_UNIT_ON_PIXELS;
    }


}

