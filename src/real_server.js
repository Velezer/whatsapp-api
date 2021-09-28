const db = require('./model/db')
const http = require('http')
const socketIO = require('socket.io')
const process = require('process')
const bcrypt = require("bcrypt")


const app = require("./app")(db, bcrypt)

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
    socket.emit('log', 'Connected to server. Please, create a client')
})


let port = process.env.PORT || 5555
server.listen(port, function () {
    console.log('App running on *: ' + port)
})
