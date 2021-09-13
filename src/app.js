require('./db')
const express = require('express')
const { manager } = require('./client-waweb')
const Handler = require('./handler')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
const { validateReqSendMessages, validateReqSendMedia } = require('./validator')
const fileUpload = require('express-fileupload');


const app = express()
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

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cors({ credentials: true, origin: '*' }));



io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');

  socket.on('create-session', async (_id) => {
    socket.emit('log', `create-session with id: ${_id}`);

    const sessionData = await manager.findSession(_id)
    const client = manager.createClient(sessionData)
    client.setEmitter(socket)
    manager.pushClient(client)
  })

});




app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


app.post('/api/send-message', validateReqSendMessages, (req, res) => Handler.sendMessage(req, res))
app.post('/api/send-media', validateReqSendMedia, (req, res) => Handler.sendMedia(req, res))


let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});