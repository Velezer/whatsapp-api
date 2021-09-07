const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const http = require('http');
const socketIO = require('socket.io');


app = express()
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // false by default
});



app.post('/api/send-messages', (req, res) => {
  numbers = [`6283842455250@c.us`,`6283842455250@c.us`,`6283842455250@c.us`]
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    clientWaweb.sendMessage(num, `world${i}`)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }
  res.status(200).json({
    message: `called`
  });
})



io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  clientWaweb = new ClientWaweb()
  clientWaweb.setSocket(socket)

});























port = 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});