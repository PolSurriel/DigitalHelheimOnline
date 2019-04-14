window.joined = false;

var socket;
var id;
var token;

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
                for (let i = 0; i < online_players.added; i++) {
                    if(online_players[i].token == data.playerToken){
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
                

            } else if(data.action.type == 'mouseClick') {
                for (let i = 0; i < online_players.added; i++) {
                    if(online_players[i].token == data.playerToken){
                        online_players[i].controller.mleft.clicked = data.action.down;
                    }
                }

            } else if(data.action.type == 'mouseMov') {
                for (let i = 0; i < online_players.added; i++) {
                    if(online_players[i].token == data.playerToken){
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
            for (let i = 0; i < online_players.added; i++) {//**************** */
                if(online_players[i].token == data.playerToken){
                    online_players[i].x = data.x;
                    online_players[i].y = data.y;

                }
                
            }


        }
    });

    
    socket.on('die', function(data){
        if(data.token != token){
            // TODO
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
    

    setInterval(() => {
        sharePosition(pj.x, pj.y);
      }, 1000);
      
}


// Envios
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



