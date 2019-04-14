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

    multiply (matrix) {
        this.assign(Matrix.GPUMultiplication4x4( 
                matrix, this.getVectorMatrix()
            ).toArray(gpu));
    }

    translate(tx,ty,tz){  
        if(isNaN(tx)) console.log('NAN');

        this.assign(
            Matrix.getTransform([0,0,0],
                Matrix.translate4x4( Matrix.getBasic4x4(),
                    [
                        1,0,0,tx,
                        0,1,0,ty,
                        0,0,1,tz,
                        0,0,0, 1,

                    ], this.x, this.y, this.z, this.w
                )             
            )
        );
    }


    scale(x,y,z){
        this.multiply(  
            [
                [x,0,0,0],
                [0,y,0,0],
                [0,0,z,0],
                [0,0,0,1]
            ]
        ); 

    }

    rotateAroundX(radians){
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        
        this.multiply(
            [
                [1, 0  , 0   , 0],
                [0, cos, -sin, 0],
                [0, sin, cos , 0],
                [0, 0  , 0   , 1]
            ]
        ); 
        
    }

    rotateAroundY(radians){
        
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        
        
        this.multiply(  
            [
                [cos , 0, sin, 0],
                [0   , 1, 0  , 0],
                [-sin, 0, cos, 0],
                [0   , 0, 0  , 1]
            ]
        ); 
    }

    rotateZ(radians){
        
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        
        
        this.assign(
            Matrix.getTransform([0,0,0],
                Matrix.rotateZ(Matrix.getBasic4x4(),
                [
                    cos, -sin, 0, 0,
                    sin,  cos, 0, 0,
                    0  ,  0  , 1, 0,
                    0  ,  0  , 0, 1
                ],
                this.x,this.y,this.z
                )
            )
        ); 
    }

}



