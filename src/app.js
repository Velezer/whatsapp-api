const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const http = require('http');
const socketIO = require('socket.io');


app = express()
const server = http.createServer(app);
const io = socketIO(server);

clientWaweb= new ClientWaweb()

app.get('/', (req, res) => {
    res.status(200).json({
        opo: `oppo?`
    })
})

app.post('/api/send-message', (req, res) => {
    clientWaweb.sendMessage(`628384245525@c.us`,`world`)
    .then(response=>{
        res.status(200).json({
            response: response
          });
    })
    .catch(err=>{
        res.status(500).json({
            response: err
          });
    })
})


io.on('connection', function(socket) {
    socket.emit('message', 'Connecting...');
 
    clientWaweb.setSocket(socket)
    
  });























port = 8181
server.listen(port, function () {
    console.log('App running on *: ' + port);
});