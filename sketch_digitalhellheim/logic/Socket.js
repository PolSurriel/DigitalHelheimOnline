window.joined = false;

var socket;
var id;
var token;

var online = false;

var SERVER_IP = 'localhost';


initSocket = function () {
    
    socket = window.io.connect(SERVER_IP, {'forceNew':true});
    
    socket.emit('join_request', {name:name});

    socket.on('join', function(data){
        console.log(data.text);
        window.joined = true;
        id = data.id;
        token = data.token;
        sharePosition(pj.x, pj.y);

        data.players.forEach(player => {
            if(player.id != token) online_players.addObj(new OnlinePlayer(player.name, player.id, -1000,-1000));
        });
    });

    socket.on('userJoin', function(data){
        console.log(data.text+' - '+data.name);
        online_players.addObj(new OnlinePlayer(data.name, data.token, -1000,-1000));
        
    });

    socket.on('playerAction', function(data){
        
        if(data.playerToken != token){
            if(data.action.type == 'key') {
                for (let i = 0; i < online_players.length; i++) {
                    if(online_players[i] != null && online_players[i].token == data.playerToken){
                        if(data.action.code == online_players[i].controller.right.code){
                            online_players[i].controller.right.pressed = data.action.down;

                        } else if(data.action.code == online_players[i].controller.left.code){
                            online_players[i].controller.left.pressed = data.action.down;

                        } else if(data.action.code == online_players[i].controller.top.code){
                            online_players[i].controller.top.pressed = data.action.down;

                        } else if(data.action.code == online_players[i].controller.bottom.code){
                            online_players[i].controller.bottom.pressed = data.action.down;

                        } else if(data.action.code == online_players[i].controller.jump.code){
                            online_players[i].controller.jump.pressed = data.action.down;

                        } 
    
                    }
                    
                }
                

            } else if(data.action.type == 'mouseLeftClick') {
                for (let i = 0; i < online_players.length; i++) {
                    if(online_players[i] != null && online_players[i].token == data.playerToken){
                        online_players[i].controller.mLeft.clicked = data.action.down;
                    }
                }

            }else if(data.action.type == 'mouseRightClick') {
                for (let i = 0; i < online_players.length; i++) {
                    if(online_players[i] != null && online_players[i].token == data.playerToken){
                        online_players[i].controller.mRight.clicked = data.action.down;
                    }
                }

            } else if(data.action.type == 'mouseMov') {
                for (let i = 0; i < online_players.length; i++) {
                    if(online_players[i] != null && online_players[i].token == data.playerToken){
                        online_players[i].last_mouse_vector = data.action.vector;
                    }
                }
            }

        }

    });

    socket.on('playerSetPosition', function (data) {
        if(data.playerToken == token){
            //TODO
            

        }else{
            //TODO
            
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].x = data.x;
                    online_players[i].y = data.y;

                }
                
            }


        }
    });

    
    socket.on('setLightningPos', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].modifyLPos = false;
                    online_players[i].lighting.point2 = new SuperVector(data.point.x, data.point.y, 0);
                    online_players[i].lighting.point2.w = 1;
                    
                }
                
            }
        }
    });

    socket.on('die', function(data){
        if(data.token != token){
            // TODO
        }
    });

    socket.on('playerLeft', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    
                    online_players.destroy(i);
                }
                
            }

        }
    });

    socket.on('unlockPlayer', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].modifyLPos = true;
                    
                }
                
            }
        }
    });

    socket.on('die', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].alive = false;
                }
                
            }

        }
    });
    

    socket.on('respawn', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].alive = true;
                }
                
            }

        }
    });

    socket.on('motorActivation', function(data){
        motorsDamage[data.i] = true;
    });

    socket.on('motorDesactivation', function(data){
        motorsDamage[data.i] = false;
    });

    socket.on('youCanShoot', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].can_shoot = true;
                }
                
            }

        }
    });


    
    socket.on('heGotTheRestorer', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    restorer.reference = online_players[i];
                    restorer.following = true;
                    restorer.inComing = true;
                    
                }
                
            }

        }
    });

    socket.on('youCantShoot', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].can_shoot = false;
                }
                
            }

        }
    });
    
    socket.on('kill', function (data) {
        if(data.murder != token){
            if(data.killedToken == token){
                //TODO

            }else {
                //TODO

            }
        }
    });

    socket.on('damageToA7', function (data) {
        if(data.murder != token){
            if(data.killedToken != token){
                boss.health -= data.damage;

            }
        }
    });

    socket.on('throwRestorer', function (data) {
        if(data.murder != token){
            if(data.killedToken != token){
                
                restorer.following = false;
                restorer.inComing = false;
                clearInterval(restorer.contdown_interval);
                restorer.reference = false;
                restorer.contdown = 5;
                restorer.force = data.force
                restorer.speed = 300;

            }
        }
    });


    socket.on('a7invoke', function (data) {
        invoke_a_boss();
    });

    
    

    setInterval(() => {
        sharePosition(pj.x, pj.y);
      }, 1000);
      
}


// Envios

function activeMotorDamage(i){
    socket.emit('motorActivation', {
        i:i
    });
}

function desactiveMotorDamage(i){


    socket.emit('motorDesactivation', {
        i:i
    });
}

function respawn(){
    socket.emit('respawn', {
        token:token
    });

    sharePosition(pj.x,pj.y);

}

function throwRestorer(force, position){
    socket.emit('throwRestorer', {
        token:token,
        force:force,
        position:position
    });
}

function iGotTheRestorer(){
    socket.emit('iGotTheRestorer', {
        token:token
    });
}

function shareA7Invocation () {
    socket.emit('a7invoke', {
        token:token
    });
}

function shareDeath(){
    socket.emit('killMe', {
        token:token
    });
}


function unlockMyselfToOthers () {
    socket.emit('unlockMe', {
        token:token
    });
}

function iCanShoot () {
    socket.emit('iCanShoot', {
        token:token
    });
}
function iCantShoot () {
    socket.emit('iCantShoot', {
        token:token
    });
}

function shareLightningPos(point){
    socket.emit('shareLightningPos', {
        point:point,
        token:token
    });

}

function damageToA7(damage){
    socket.emit('damageToA7', {
        damage:damage,
        token:token
    });
}


function sharePosition(x, y){
    socket.emit('sharePosition', {
        x:x,
        y:y,
        token:token
    });
}

function shareAction(action){
    socket.emit('action', {
        action:action,
        token:token
    });
}

function kill(killedToken){
    socket.emit('kill', {
        murder:token,
        killedToken:killedToken
    });
}

function die () {
    socket.emit('die', {
        token:token
    });
}



