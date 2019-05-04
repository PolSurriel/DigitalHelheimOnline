var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = new Array();


var roomData = {
    boss_invoked:false,
    invoked_moment:null,
    restorer_reference:null,
    boss_health:100,
    motors_broken:false,
    motors_broken_moment:null,
    motors_state:[false,false,false,false,false,false],
    restorer_position:null,
    restorer_force:null,
    time_reference:new Date(),
    
}

app.use(express.static('../sketch_digitalhellheim'));

var tokens = 0;

io.on('connection', function(socket){

    
    // Check sockets disconnected
    setInterval(function() {
        if (players.length == 0)
            roomData = {
                boss_invoked:false,
                invoked_moment:null,
                restorer_reference:null,
                boss_health:100,
                motors_broken:false,
                motors_broken_moment:null,
                motors_state:[false,false,false,false,false,false],
                restorer_position:null,
                restorer_force:null,
                time_reference:new Date(),
                
            }

        for (var i = 0; i < players.length; i++) {
            if(io.sockets.sockets[players[i].socketId] == undefined){
                io.sockets.emit('playerLeft',{playerToken: players[i].id, text:'Un jugador ha abandonado la sesion'});
                players.splice(i, 1);
                
            }
        }

        console.clear();
        console.log("-- Players in session:\n",players);
        
    }, 3000);

    // JOIN REQUEST
    socket.on('join_request', function (data) {

        
        players.forEach(function (player) {
            if(socket.id == player.socketId){
                player.name = data.name;
            }
        });

        socket.emit('join',{
            id:socket.id,
            token:token,
            players:players,
            text:'Te has unido a la sesión.'
        });

        players.forEach(function (player) {
            if(socket.id != player.socketId){
                io.to(player.socketId).emit('userJoin',
                {
                    name:data.name,
                    token:token, 
                    text:'Un jugador se ha unido a la sesion'
                });
            }
        }, this);
    

    });
    
    // USER JOINED TO SESION
    var token = ++tokens;
    players.push({ id:token, socketId:socket.id, name:socket.nombre });
    socket.emit('mensaje',{ text:'Pulsa [F11] para jugar en PANTALLA COMPLETA'});

    // -------------------------------------


    // GAMEPLAY EVENTS

    socket.on('throwRestorer',function (data) {
        io.emit('throwRestorer', { 
            playerToken:data.token,
            force:data.force,
            position:data.position
        });

        roomData.restorer_force = data.force;
        roomData.restorer_position = data.position;
    });

    socket.on('motorActivation',function (data) {
        io.emit('motorActivation', { 
            i:data.i
        });

        roomData[data.i] = true;
    });

    socket.on('motorDesactivation',function (data) {
        io.emit('motorDesactivation', { 
            i:data.i
        });

        roomData[data.i] = false;
    });

    socket.on('iGotTheRestorer',function (data) {
        io.emit('heGotTheRestorer', { 
            playerToken:data.token
        });

        roomData.restorer_reference = data.token;
    });

    
    socket.on('askForRoomState',function (data) {
        io.emit('setRoomState', { 
            room_data:roomData
        });
    });

    socket.on('damageToA7',function (data) {
        io.emit('damageToA7', { 
            playerToken:data.token,
            damage:data.damage
        });

        roomData.boss_health -= data.damage;
    });

    socket.on('killMe',function (data) {
        io.emit('die', { 
            playerToken:data.token,
        });
    });

    socket.on('iCanShoot',function (data) {
        io.emit('youCanShoot', { 
            playerToken:data.token,
        });
    });

    socket.on('createA7Projectile',function (data) {
        io.emit('createA7Projectile', { 
            playerToken:data.token,
            parameters:data.parameters,
            obj_id:data.obj_id
        });
    });


    
    socket.on('destroyA7Projectile',function (data) {
        io.emit('destroyA7Projectile', { 
            token:token,
            obj_id:data.obj_id,
            addHolding:data.addHolding
        });
    });



    
    socket.on('iCantShoot',function (data) {
        io.emit('youCantShoot', { 
            playerToken:data.token,
        });
    });

    socket.on('imthehost',function (data) {
        io.emit('heisthehost', { 
            playerToken:data.token,
        });
    });

    

    socket.on('a7invoke',function (data) {
        io.emit('a7invoke', { 
            playerToken:data.token,
        });

        roomData.boss_invoked = true;
        roomData.invoked_moment = new Date();


    });

    socket.on('respawn',function (data) {
        io.emit('respawn', { 
            playerToken:data.token,
        });
    });

    
    socket.on('unlockMe',function (data) {
        io.emit('unlockPlayer', { 
            playerToken:data.token,
        });
    });

    socket.on('shareLightningPos',function (data) {
        io.emit('setLightningPos', { 
            playerToken:data.token,
            point: data.point
        });
    });

    // ACTION SHARING
    socket.on('action',function (data) {
        io.emit('playerAction', { 
            playerToken:data.token,
            action: data.action
        });
    });

    // POSITION SHARING
    socket.on('sharePosition',function (data) {
        io.emit('playerSetPosition', { 
            playerToken:data.token,
            x:data.x,
            y:data.y,
            alive:data.alive
        });
    });

    // DIE
    socket.on('die',function (data) {
        io.emit('die', {
            token:data.token
        });
    });


    // MESSAGE
    socket.on('env', function(data){ 
        io.sockets.emit('mensaje',{ text:'@anon: '+data.text});
    });

    
    // KILL
    socket.on('kill',function (data) {
        io.emit('kill', {
            murder:data.murder,
            killedToken:data.killedToken
        });
    });

    
});

server.listen(80, function(){
    console.clear();
    console.log('SERVER STARTED');
});