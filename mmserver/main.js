var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = new Array();

app.use(express.static('../sketch_digitalhellheim'));

var tokens = 0;

io.on('connection', function(socket){

    
    // Check sockets disconnected
    setInterval(function() {
        for (var i = 0; i < players.length; i++) {
            if(io.sockets.sockets[players[i].socketId] == undefined){
                io.sockets.emit('playerLeft',{id: players[i].id, text:'Un jugador ha abandonado la sesion'});
                players.splice(i, 1);
                
            }
        }

        console.clear();
        console.log("-- Players in session:\n",players);
        
    }, 3000);

    // JOIN REQUEST
    socket.on('join_request', function (data) {

        socket.emit('join',{
            id:socket.id,
            token:token,
            players:players,
            text:'Te has unido a la sesión.'
        });

    });
    
    // USER JOINED TO SESION
    var token = ++tokens;
    players.push({ id:token, socketId:socket.id });
    
    players.forEach(function (player) {
        if(socket.id != player.socketId){
            io.to(player.socketId).emit('userJoin',
            {
                id:token, 
                text:'Un jugador se ha unido a la sesion'
            });
        }
    }, this);

    socket.emit('mensaje',{ text:'Pulsa [F11] para jugar en PANTALLA COMPLETA'});

    // -------------------------------------


    // GAMEPLAY EVENTS

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
            y:data.y 
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