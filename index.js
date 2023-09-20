const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
  const indexPath = path.join(__dirname,  'index.html');
  res.sendFile(indexPath);
});


const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    // console.log('new user' , name);
    if(name){
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);

    }
  });

  socket.on('send', (message)=>{
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
  });

  socket.on('disconnect', (message)=>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id]
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});