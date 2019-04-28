 //out and a are 4x4 
      /*
    0,  1,  2,  3,       0,  1,  2,  3,  
    4,  5,  6,  7,       4,  5,  6,  7,
    8,  9,  10, 11,      8,  9,  10, 11,
    12, 13, 14, 15       x , y, z, 15 
    
    */

   class Matrix {

    static getBasic4x4 = function () { return [
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0
    ];}
  
    static getTranslationMatrix(tx,ty,tz) {
      return [1, 0, 0, tx,
              0, 1, 0, ty,
              0, 0, 1, tz,
              0, 0, 0,  1];
    }
  
    static getScalingMatrix(sx,sy,sz) {
        return [sx, 0 , 0 , 0,
                0 , sy, 0 , 0,
                0 , 0 , sz, 0,
                0 , 0 , 0 , 1];
    }
  
    static getRotationMatrix(cos,sin) {
        return [cos, -sin, 0, 0,
                sin,  cos, 0, 0,
                0  ,  0  , 1, 0,
                0  ,  0  , 0, 1];
    }
    static multipy4x4Vector(matrix, x, y, z, w) {
      
      return [ matrix[0] * x + matrix[4] * y + matrix[8]  * z + matrix[12]  + matrix[3] * w,
               matrix[1] * x + matrix[5] * y + matrix[9]  * z + matrix[13]  + matrix[7] * w,
               matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]  + matrix[11]* w]
    }  
  
  
  }
  