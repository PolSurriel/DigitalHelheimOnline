/*

Limitarnos a los bordes de la ventana era una idea que no nos llamaba la atención.
Camera es una clase estática que traduce la información en función de una referencia.
Básicamente desplaza en los dos ejes la posición obtenida en el mismo eje la 
posición de la refencia invertida. (pos - ref_pos)

Como cambiar el atributo de equivalencia de UMI era algo un poco extraño y el 
concepto de hacer zoom le pega más a esta clase, lo hemos implementado aquí.

Siguiente para leer: FollowerReference.js

*/

class Camera {

    static reference; 

    static setObjectReference(obj){
        this.reference = obj;
    }

    static translationX(x){
        return x-this.reference.x;
    }

    static translationY(y){
        return y-this.reference.y;
    }

    static translation(vector){
        v.x = Camera.translationX(v.x);
        v.y = Camera.translationX(v.y);

        return vector;
    }

    static zoom(zoom){
        UMI.UMI_UNIT_ON_PIXELS -= zoom;
        UMI.updateZoom();
    }

    static defaultZoom(){
        UMI.UMI_UNIT_ON_PIXELS = UMI.DEFAULT_UMI_UNIT_ON_PIXELS;
        UMI.updateZoom();
    }

}