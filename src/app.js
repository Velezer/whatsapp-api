const express = require('express')
require('./db')
const { SessionModel } = require('./model')
const { ClientWaweb, manager } = require('./client-waweb')
const Handler = require('./handler')
const http = require('http');
// const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
const { validateReqSendMessages, validateReqSendMedia } = require('./validator')
const fileUpload = require('express-fileupload');


const app = express()
const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     // allowedHeaders: ["my-custom-header"],
//     credentials: true
//   },
//   allowEIO3: true // false by default
// });

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cors({ credentials: true, origin: '*' }));


// io.on('connection', function (socket) {
//   socket.emit('message', 'Connecting...');

// socket.on('create-session', async (data) => {
//   socket.emit('log', 'create-sessio...?');


// const sessionData = await SessionModel.findOne(data)
//   socket.emit('log', JSON.stringify(sessionData));

// let clientWaweb = new ClientWaweb()
// // clientWaweb.setEmitter(socket)

// manager.pushClient(clientWaweb)
// console.log(`manager.clients: ${manager.clients}`)
// socket.emit('log', 'create-session...!!!!');
// })

// });

setTimeout(async () => {
  let data = {
    session: {
      WABrowserId: '"BnFTVJuEa5uyuzEzSsggNw=="',
      WASecretBundle: '{"key":"PlLog8Mb/em4ObIq0aAAI6HOgDHZiCCboyOLFQlCHNU=","encKey":"xrarqVvfbQb0G6y+jNu4el8+gQ720t2S0IsIDfILWRI=","macKey":"PlLog8Mb/em4ObIq0aAAI6HOgDHZiCCboyOLFQlCHNU="}',
      WAToken1: '"eEAyIjx8x2bfDwt1PZ6FCn5fi9VFcF1bRysW0vg7ncA="',
      WAToken2: '"1@MGNUwAUGRHMNxHoC+/cpbZUlOa8XZ8G/1iz+8RnVd6eYzaaiWcwztvxNwYbqtOTkL4oVzPep5r953g=="'
    }
  }
  const sessionData = await SessionModel.findOne(data)
  console.log(`sessionData: ${sessionData}`)
  let clientWaweb = new ClientWaweb(sessionData ? sessionData.session : null)
  // clientWaweb.setEmitter(socket)

  manager.pushClient(clientWaweb)
  // console.log(`manager.clients: ${JSON.stringify(manager.clients)}`)
}, 1);


app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})


const handler = new Handler(manager)

app.post('/api/send-messages', validateReqSendMessages, (req, res) => handler.sendMessages(req, res))
app.post('/api/send-media', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))
// app.post('/api/client', validateReqSendMedia, (req, res) => handler.sendMedia(req, res))



let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});