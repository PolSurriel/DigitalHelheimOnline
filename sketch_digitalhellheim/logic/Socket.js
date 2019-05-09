window.joined = false;

var socket;
var id;
var token;

var online = false;

var loga7 = new Array();

var asking_for_data = true;

//var SERVER_IP = '145.239.205.172';
var SERVER_IP = '192.168.1.105';

function saveInfo() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(loga7));
    
    var hiddenElement = document.createElement('a');

    hiddenElement.href = dataStr;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'a7_log.json';
    hiddenElement.click();
}


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

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'userJoin', info:data, time:new Date()
        });
        
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

            
            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'playerAction', info:data, time:new Date()
            });
        }

    });

    socket.on("denyRestorer", function(data){
        if (data.owner != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.owner){
                    clearInterval(restorer.contdown_interval);
                    restorer.reference = online_players[i];
                    restorer.following = true;
                    restorer.inComing = true;
                    restorer.contdown = 5;
                }
            }
        }

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'denyRestorer', info:data, time:new Date()
        });


    });

    socket.on('playerSetPosition', function (data) {

        if(data.playerToken == token){
            //TODO
            

        }else{
            
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].x = data.x;
                    online_players[i].y = data.y;
                    online_players[i].alive = data.alive;

                }
                
            }

            
            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'playerSetPosition', info:data, time:new Date()
            });


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

            
            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'setLightningPos', info:data, time:new Date()
            });
        }
    });



    socket.on('playerLeft', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    
                    online_players.destroy(i);
                }
                
            }

            
            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'playerLeft', info:data, time:new Date()
            });

        }
    });

    socket.on('unlockPlayer', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].modifyLPos = true;
                    
                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'unlockPlayer', info:data, time:new Date()
            });
        }
    });
    

    socket.on('dieAll', function (data){
        if(pj.alive) pj.die();
        clearInterval(restorer.contdown_interval);
        restorer.contdown = 5;

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'dieAll', info:data, time:new Date()
        });

    });

    socket.on('forceRestorerOwner', function(data){
        clearInterval(restorer.contdown_interval);

        if(data.playerToken == token) {
            restorer.reference = pj;
            restorer.following = true;
            restorer.inComing = true;
            restorer.contdown = 5;
            pj.infected = true;

        }else {
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    restorer.reference = online_players[i];
                    restorer.following = true;
                    restorer.inComing = true;
                    restorer.contdown = 5;
                    

                }
            }
        }

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'forceRestorerOwner', info:data, time:new Date()
        });
    });

    socket.on('die', function(data){
        
        for (let i = 0; i < online_players.length; i++) {
            if(online_players[i] != null && online_players[i].token == data.playerToken){
                online_players[i].alive = false;
                online_players[i].holding.setAllNull();
                online_players[i].holding_on_draw.setAllNull();
        
                if (restorer.reference == online_players[i]){
                    restorer.reference = null;
                    restorer.following = false;
                    clearInterval(restorer.contdown_interval);
                    restorer.contdown = 5;
                }
            }
            
        }

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'die', info:data, time:new Date()
        });

        
    });
    

    socket.on('respawn', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].alive = true;
                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'respawn', info:data, time:new Date()
            });

        }
    });

    socket.on('motorActivation', function(data){
        motorsDamage[data.i] = true;
        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'motorActivation', info:data, time:new Date()
        });
    });

    socket.on('motorDesactivation', function(data){
        motorsDamage[data.i] = false;
        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'motorDesactivation', info:data, time:new Date()
        });
    });

    socket.on('youCanShoot', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].can_shoot = true;
                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'youCanShoot', info:data, time:new Date()
            });

        }
    });


    
    socket.on('heGotTheRestorer', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    restorer.reference = online_players[i];
                    restorer.following = true;
                    restorer.inComing = true;
                    restorer.contdown = 5;

                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'heGotTheRestorer', info:data, time:new Date()
            });

        }
    });

    
    socket.on('message', function(data){
        mensajes.push({
            type:data.type,
            text:data.text,
            name: data.name
        });

        console.log({
            type:data.type,
            text:data.text,
            name: data.name
        });

    });

    socket.on('setRoomState', function(data){
        
        if(asking_for_data){

            console.log(data.room_data);
            asking_for_data = false;

            console.log(time);
            time = data.room_data.time;

            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.room_data.restorer_reference){
                    restorer.reference = online_players[i];
                    restorer.following = true;
                    restorer.inComing = true;
                }
                
            }

            boss.health = data.room_data.boss_health;
            if(data.room_data.boss_invoked){
                invoke_a_boss();

                boss.invoked = true;
                boss.health = data.room_data.boss_health;
            }
        }
        //motors_broken: false
        //motors_broken_moment: null
        //motors_state: (6) [false, false, false, false, false, false]
        //restorer_force: null
        //restorer_position: null
        //restorer_reference: null
        

       if (in_host_mode) loga7.push({ 
            type:'server-event', name:'setRoomState', info:data, time:new Date()
        });
    });

    socket.on('destroyA7Projectile',function (data) {

        if(data.token != token){
            for (let i = 0; i < a7Projectiles.length; i++) {
                
                if(a7Projectiles[i] != null && a7Projectiles[i].creator_id == data.token && a7Projectiles[i].obj_id == data.obj_id){
                    a7Projectiles.destroy(i);
                    break;
                }
            }

            if(data.addHolding){

                for (let i = 0; i < online_players.length; i++) {
                    if(online_players[i] != null && online_players[i].token == data.token){
                        online_players[i].holding.addObj({
                            x: Math.random()* (55 - 27) + 27,
                            y: Math.random()* (30 - 10) + 10
                        });
                    }
                }
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'unlockPlayer', info:data, time:new Date()
            });
        }

    });


    socket.on('createA7Projectile',function (data) {
        if(data.playerToken != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    var projectile = new A7Projectile( data.parameters[0], data.parameters[1], new Vector2D (data.parameters[2],data.parameters[3]).getUnitaryVector(), online_players[i] );
                    projectile.creator_id = data.playerToken;
                    projectile.obj_id = data.obj_id;
                    a7Projectiles.addObj ( projectile );
                    
                }
            }
            

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'createA7Projectile', info:data, time:new Date()
            });
        }
        
    });

    socket.on('youCantShoot', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players[i].can_shoot = false;
                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'youCantShoot', info:data, time:new Date()
            });

        }
    });

    socket.on('heisthehost', function(data){
        if(data.token != token){
            for (let i = 0; i < online_players.length; i++) {
                if(online_players[i] != null && online_players[i].token == data.playerToken){
                    online_players.destroy(i);
                }
                
            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'heisthehost', info:data, time:new Date()
            });

        }
    });
    

    socket.on('damageToA7', function (data) {
        if(data.token != token){
            if(data.playerToken != token){
                boss.health -= data.damage;

            }

            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'damageToA7', info:data, time:new Date()
            });
        }
    });


    

    socket.on('throwRestorer', function (data) {
        if(data.playerToken != token){
            if(restorer.reference != null && restorer.reference != undefined){
                restorer.reference.setInmuneState();
            }

            restorer.following = false;
            restorer.inComing = false;
            clearInterval(restorer.contdown_interval);
            restorer.reference = false;
            restorer.contdown = 5;
            restorer.force = data.force
            restorer.tokillAll = true;
            restorer.speed = 300;
            restorer.y = data.player_pos.y;
            restorer.x = data.player_pos.x;


            if (in_host_mode) loga7.push({ 
                type:'server-event', name:'throwRestorer', info:data, time:new Date()
            });
        }
        
    });


    socket.on('a7invoke', function (data) {
        invoke_a_boss();

        if (in_host_mode) loga7.push({ 
            type:'server-event', name:'a7invoke', info:data, time:new Date()
        });
    });

    socket.on('sec', function (data){
        console.log('sec');
    });

    
    

    setInterval(() => {
        sharePosition(pj.x, pj.y);
        
      }, 1000);
      
}


// Envios

function sendMessage(text){
    socket.emit('sendMessage', {
        text:text,
        name:name

    });
}

function createAway(){

}

function askForRoomState(){
    socket.emit('askForRoomState', {
        token:token
    });
}

function shareimhost(){
    socket.emit('imthehost', {
        token:token
    });
}

function activeMotorDamage(i){
    console.log("MOTOR ACTIVE REF:"+i);
    socket.emit('motorActivation', {
        i:i
    });
}

function desactiveMotorDamage(i){
    socket.emit('motorDesactivation', {
        i:i
    });
}

function shareFailedRestorer(){
    socket.emit('dieAll', {
        token:token
    });
}

function respawn(){
    socket.emit('respawn', {
        token:token
    });

    sharePosition(pj.x,pj.y);

}

function createA7Projectile(parameters, obj_id){
    socket.emit('createA7Projectile', {
        token:token,
        parameters:parameters,
        obj_id:obj_id
    });
}

function destroyA7Projectile(projectile,addHolding){
    socket.emit('destroyA7Projectile', {
        token:token,
        obj_id:projectile.obj_id,
        addHolding:addHolding
    });

}



function throwRestorer(force, position){
    socket.emit('throwRestorer', {
        token:token,
        force:force,
        position:position,
        player_pos:{x:pj.x,y:pj.y}
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
        token:token,
        alive:pj.alive,
        is_owner: (restorer.reference == pj)
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



