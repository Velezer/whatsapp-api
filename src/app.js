const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const Handler = require('./handler')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
const { validateReqSendMessage, validateReqSendMessages } = require('./validator')

const app = express()
app.use(cors({ credentials: true, origin: '*' }));
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  allowEIO3: true // false by default
});

const clientWaweb = new ClientWaweb(`1`)

io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  clientWaweb.setSocket(socket)

});



app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


const handler = new Handler(clientWaweb)
app.post('/api/send-message', validateReqSendMessage, (req, res) => handler.sendMessage(req, res))

app.post('/api/send-messages', validateReqSendMessages, (req, res) => handler.sendMessages(req, res))



let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});