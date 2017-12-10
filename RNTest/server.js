var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
  // here you can start emitting events to the client 
  console.log(socket + " has Connected! Welcome :)");
  socket.on('im here', () => {
  	console.log(client.id + ' subscribed');
  	socket.emit('successful','yes');
  })
});
const port = 8000
io.listen(port);
console.log('listening on port: ', port);