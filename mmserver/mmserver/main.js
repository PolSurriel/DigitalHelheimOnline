/*
  
  SOCKET IO GUIDE:
 
 // send to current request socket client
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.sockets.emit('message', "this is a test"); //still works
 //or
 io.emit('message', 'this is a test');

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 // docs says "simply use to or in when broadcasting or emitting"
 io.in('game').emit('message', 'cool game');

 // sending to individual socketid, socketid is like a room
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');

 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var room = 0;
var waiting_to_join = false;
var rooms_waiting = new Array();

var rooms = {};

const MAX_ROOMS = 1000;

function senderAsRoom (socket){
    return Object.keys(socket.rooms).length == 0;
}

function getRoom(socket){
    return socket.rooms[Object.keys(socket.rooms)[0]];
}

io.on('connection', function(socket){

    // GAMEPLAY EVENTS
    socket.on('SHARE_PLAYER_ACTION', function (data) {
        socket.broadcast.in(getRoom(socket)).emit('PLAYER_ACTION', { 
            info: data
        });
    });

    socket.on('SHARE_GAME_EVENT', function (data) {
        socket.broadcast.in(getRoom(socket)).emit('GAME_EVENT', { 
            info: data
        });
    });

    socket.on('PLAYER_DATA_CONTORL', function (data) {

        socket.broadcast.in(getRoom(socket)).emit('PLAYER_DATA_CONTROL', { 
            info: data
        });
    });

    socket.on('ASK_MATCH_INFO', function (data) {
        socket.broadcast.in(getRoom(socket)).emit('GIVE_MATCH_INFO', { 
            info: data
        });
    });

    
    socket.on('SHARE_MATCH_INFO', function (data) {
        socket.broadcast.in(getRoom(socket)).emit('MATCH_INFO', { 
            info: data
        });
    });

    //CONNECTION / DISCONNECTION

    socket.on('disconnect', function () {

        
        if(senderAsRoom(socket)){

            if (rooms_waiting.includes( rooms[socket.id] )){
                //MAKE SURE ROOM IS DESTROYED
                //console.log("A room was destroyed");
                rooms_waiting.splice(rooms_waiting.indexOf(rooms[socket.id]), 1);

            }else {
                rooms_waiting.push(rooms[socket.id]);
                
                io.in(getRoom(socket)).emit('PLAYER_LEFT', { 
                    info: 'PLAYER_LEFT'
                });
                //console.log("A room is waiting for a player");
                //console.log(rooms_waiting);
            }


        }else {
            waiting_to_join = false;
            
        }
        
    });

    socket.on('USER_CONNECT',function (data) {

        console.log("CONN");

        if(rooms_waiting.length > 0){

            var theRoom = rooms_waiting.shift();
            socket.join(theRoom,function(){  });
            rooms[socket.id] = theRoom;

            socket.broadcast.in(theRoom).emit('GIVE_MATCH_INFO', { 
                info: data
            });
            
            socket.emit('JOIN_STARTED_GAME', { 
                info: ''
            });
            
            //console.log("Player joined to a room waiting:");
            //console.log(theRoom);

        } else{
            
            socket.join(room,function(){  });
            rooms[socket.id] = room;
            
            var playerLocalId = (waiting_to_join) ? 2:1;

            io.in(room).emit('looking', { 
                info: 'Matchmaking...',
                id:playerLocalId
            });
            
            if(waiting_to_join){
                
                //START GAME
                waiting_to_join = false;
                
                io.in(room).emit('START_GAME', { 
                    info: ''
                });
                room = ++room %MAX_ROOMS;
    
                //console.log("Created new room. ID: "+room);
            }else {
                waiting_to_join = true;
            }
            
        } 
     

    });
});

server.listen(80, function(){
    console.clear();
    console.log('SERVER STARTED');

});