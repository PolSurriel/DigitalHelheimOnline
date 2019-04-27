/*
Historia:

Cuando quisimos hacer la "migración lógica" de vectores a matrices
habían razonamientos que nos causaban disonancia cognitiva. Si
bien era impepinable que el uso de matrices es necesario, no nos
era de agrado cómo esto complicaría el código. Por esa razón nos 
pusimos a pensar y observar.

Concluimos que debíamos proteger al programador de la complejidad.
Es nuestro código el que debe asumir esa implementación. Hicimos
la broma de que necesitábamos a un superhéroe que hiciera los
cálculos con matrices por nosotros y lo enmascarase como un
vector. Y por eso decidimos llamar a esta clase "SuperVector",
porque la creamos pensando en ella como un superhéroe. Un
caballero honorable que esconde su labor y sin que el programador
lo sepa hace los cálculos con matrices y le permite pensar con 
una lógica más intuitiva. Sonriendo en silencio y con complicidad
a cada transformación.

*/

class SuperVector {

    x = 0;
    y = 0;
    z = 0;
    w = 0;

    transform = {
        rotation:{
            x:0,
            y:0,
            z:0
        },
        scale:{
            x:0,
            y:0,
            z:0
        },
        translation:{
            x:0,
            y:0,
            z:0
        }
    }

    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        // w = 1 porque es un vector 
        this.w = 1;
    }    

    getMagnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    }

    getMagnitude2D(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    toUnitary(){
        var mag = this.getMagnitude();
        this.x = this.x/mag;
        this.y = this.y/mag;
        this.z = this.z/mag;
    }

    toUnitary2D(){
        var mag = this.getMagnitude2D();
        this.x = this.x/mag;
        this.y = this.y/mag;
    }

    assign(matrix){

        this.x = matrix[0];
        this.y = matrix[1];
        this.z = matrix[2];

    }

    translate(tx,ty,tz){
        this.assign(
            Matrix.multipy4x4Vector(
                Matrix.getTranslationMatrix(tx,ty,tz),
                this.x, this.y, this.z, this.w
            )            
        );
    }


    rotateAxisZ(axis, radians){
        this.translate(-axis.x, -axis.y, 0);
        this.rotateZ(radians);
        this.translate(axis.x, axis.y, 0);
    }

    scale(sx,sy,sz){
        this.assign(
            Matrix.multipy4x4Vector(
                Matrix.getScalingMatrix(sx,sy,sz),
                this.x, this.y, this.z, this.w
            )            
        );
    }

    rotateZ(radians){
        this.assign(
            Matrix.multipy4x4Vector(
                Matrix.getRotationMatrix(Math.cos(radians),Math.sin(radians)),
                this.x, this.y, this.z, this.w
            )            
        );
    }

    // rotateAxisZ(axis, radians){
    //     var cos = Math.cos(radians);
    //     var sin = Math.sin(radians);

    //     var result = [
    //         this.x*cos-this.y*sin+this.w*(-cos*axis.x+axis.x+sin*axis.y),
    //         this.y*cos+this.x*sin+this.w*(-sin*axis.x-cos*axis.y+axis.y),
    //         this.z
    //     ];

    //     this.assign(result);
    // }

}



