require('./model/db')
const express = require('express')
const { manager } = require('./waweb/manager')
const { SessionModel } = require('./model/session')// put this below db
const { UserModel } = require('./model/user')// put this below db
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const process = require('process')
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


io.on('connection', (socket) => {
  socket.emit('message', 'Connecting...');

  socket.on('create-session', async ({ user, password, number }) => {
    socket.emit('log', `create-session`);

    const userData = await UserModel.findOne({ user, password, number })

    if (userData === null) {
      socket.emit('log', `no user with user: ${user} and number: ${number}`);
      return
    }

    socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`);

    const sessionData = await SessionModel.findOne({ _id: userData.session_id })
    console.log(sessionData)
    const client = manager.createClient(sessionData.session, userData)

    client.setEmitter(socket)
    manager.pushClient(client)
    socket.emit('log', `creating client...`);

  })

});




app.get('/', (req, res) => {
  res.status(200).json({
    message: `see?`
  });
})

app.use('/api/waweb', require("./routes/waweb"))
app.use('/api/user', require("./routes/user"))

let port = process.env.PORT || 5555
server.listen(port, function () {
  console.log('App running on *: ' + port);
});