class MegaMatrix {

    static entities;
    static input;
    static output;

    static nullMatrix = [
        [1],
        [1],
        [1],
        [1]
    ];

    static initialize(){
        MegaMatrix.input = new Array (32);
        for (let i = 0; i < MegaMatrix.input.length; i++) {
            MegaMatrix.input[i] = new Array (512);
        }

        MegaMatrix.output = new Array (32);
        for (let i = 0; i < MegaMatrix.output.length; i++) {
            MegaMatrix.output[i] = new Array (512);
        }

    }

    static calculate(){
        
        
    }




}