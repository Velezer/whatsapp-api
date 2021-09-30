const db = require('./model/db')
const http = require('http')
const socketIO = require('socket.io')
const process = require('process')
const manager = require('./waweb/manager')
const bcrypt = require("bcrypt")
const createApp = require("./app")

const app = createApp(db, bcrypt, manager)

const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true // false by default
})


io.use(require("./middleware/ioAuth"))
io.use(require("./middleware/ioCreateClient"))


io.on('connection', (socket) => {
    socket.emit('log', 'Connected to server')
})


let port = process.env.PORT || 5555
server.listen(port, function () {
    console.log('App running on *: ' + port)
})
