const gpu = new GPU();

class Matrix {

  static getTransform(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }

  static getScaling(out, mat) {
    let m11 = mat[0];
    let m12 = mat[1];
    let m13 = mat[2];
    let m21 = mat[4];
    let m22 = mat[5];
    let m23 = mat[6];
    let m31 = mat[8];
    let m32 = mat[9];
    let m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }



  static getBasic4x4 = function () { return [
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0
  ];}

  //out and a are 4x4 
      /*
    0,  1,  2,  3,       0,  1,  2,  3,  
    4,  5,  6,  7,       4,  5,  6,  7,
    8,  9,  10, 11,      8,  9,  10, 11,
    12, 13, 14, 15       x , y, z, 15 
    
    */

  static translate4x4(out, a, x, y, z, w) {

    out[12] = a[0] * x + a[4] * y + a[8]  * z + a[12]  + a[3]*  w;
    out[13] = a[1] * x + a[5] * y + a[9]  * z + a[13]  + a[7]*  w;
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]; + a[11]* w;

    return out;
  }


  static rotateZ(out, a, x, y, z) {


    out[12] = a[0] * x + a[4] * y + a[8]  * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9]  * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];

    return out;
  }
  


  static scale(out, a, x, y, z) {

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];

    return out;
  }


  static GPUMultiplication4x4 = gpu.createKernel(function(a, b) {
      var sum = 0;
      for (var i = 0; i < 4; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    }).setOutput([4, 1]).setOutputToTexture(true);

      
  static GPUtranslate4x4 = gpu.createKernel(function(out, a, x, y, z, w) {

    var sum = 0;
    
    sum+= a[0] * x + a[4] * y + a[8]  * z + a[12];
    sum+= a[1] * x + a[5] * y + a[9]  * z + a[13];
    sum+= a[2] * x + a[6] * y + a[10] * z + a[14];
    
    return sum;
  }).setOutput([16]);

}
