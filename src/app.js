const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const http = require('http');
const socketIO = require('socket.io');


app = express()
const server = http.createServer(app);
const io = socketIO(server,{
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // false by default
});

clientWaweb= new ClientWaweb()


app.post('/api/send-message', (req, res) => {
    clientWaweb.sendMessage(`6283842455250@c.us`,`world`)
    .then(response=>{
        res.status(200).json({
            response: response
          });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            response: err
          });
    })
})


io.on('connection', function(socket) {
    socket.emit('message', 'Connecting...');
 
    clientWaweb.setSocket(socket)
    
  });























port = 5555
server.listen(port, function () {
    console.log('App running on *: ' + port);
});