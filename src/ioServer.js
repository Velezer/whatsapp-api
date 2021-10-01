const http = require('http')
const socketIO = require('socket.io')
const createApp = require("./app")


/**
 * 
 * @param {object} db { UserModel, ContactsModel }
 * @param {bcrypt} bcrypt 
 * @param {ManagerWaweb} manager 
 * @returns server
 */
module.exports = (db, bcrypt, manager) => {
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


    io.use(async (socket, next) => {
        socket.db = db
        socket.bcrypt = bcrypt
        socket.manager = manager
        next()
    })

    io.use(require("./middleware/ioAuth"))
    io.use(require("./middleware/ioCreateClient"))


    io.on('connection', (socket) => {
        socket.emit('log', 'Connected to server')
        socket.emit('connected', 'connected')
    })

    return server
}
