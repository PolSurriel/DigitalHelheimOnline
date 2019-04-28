/*
No quisimos usar la clase de vectores de processing. Pero echábamos de menos tener
una que encapsulara todos los métodos que fuéramos a utilizar. Esta es nuestra
propia clase Vector2D.

Siguiente lectura: UMI.js

*/


class Vector2D {
    x;
    y;

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    getMagnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    getUnitaryVector(){
        var magnitude = this.getMagnitude();
        return new Vector2D(this.x/magnitude,this.y/magnitude);
    }

    getInverseVector(){
        return new Vector2D(this.x*(-1),this.y*(-1));
    }

    getAngle(){
        return Math.atan2(this.y, this.x);
    }

    convertToUnitary(){
        var magnitude = this.getMagnitude();
        this.x = this.x/magnitude;
        this.y = this.y/magnitude;
    }

    rotate(angle){
        var newDirection = this.getAngle() + angle;
        var magnitude = this.getMagnitude();
        this.x = Math.cos(newDirection) * magnitude;
        this.y = Math.sin(newDirection) * magnitude;
    }

    convertToInverse(){
        this.x *= -1; 
        this.y *= -1;
    }

    static getProjetionVector(u,v){
        var numerador = u.x * v.x + u.y * v.y;
        var denominador = v.getMagnitude() * v.getMagnitude();
        var escalar = numerador / denominador;

        return new Vector2D(escalar * v.x, escalar * v.y);
    }

    static getNormalVector(u,v){
        var projection = Vector2D.getProjetionVector(u,v);
        return new Vector2D(u.x - projection.x, u.y - projection.y);
    }

    static getReboundVector(u,v){
        var projectionVector = Vector2D.getProjetionVector(u,v);
        var normalVector = Vector2D.getNormalVector(u,v);
        
        return new Vector2D(projectionVector.x - normalVector.x, projectionVector.y - normalVector.y);
    }

    static getAngleBetweenTwoVectors(u,v){
        var magnitudeU = u.getMagnitude();
        var magnitudeV = v.getMagnitude();
        return Math.acos((u.x*v.x+u.y*v.y)/(magnitudeU*magnitudeV));
    }

    static createVectoByAngle(angle){
        return new Vector2D(Math.cos(angle),Math.sin(angle));
    }
}