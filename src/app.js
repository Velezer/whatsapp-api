const express = require('express')
const { ClientWaweb } = require('./client-waweb')
const Handler = require('./handler')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
const { validateReqSendMessages, validateReqSendMedia } = require('./validator')
const fileUpload = require('express-fileupload')

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

const clientWaweb = new ClientWaweb(`kreblast`)

io.on('connection', function (socket) {
  socket.emit('message', 'Connecting...');
  
  clientWaweb.setEmitter(socket)

});




app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


const handler = new Handler(clientWaweb)

app.post('/api/send-messages', validateReqSendMessages, (req, res) => handler.sendMessages(req, res))
app.post('/api/send-media', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))



let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});