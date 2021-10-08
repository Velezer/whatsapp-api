const db = require('./model/db')
const http = require('http')
const socketIO = require('socket.io')
const process = require('process')
const ManagerWaweb = require('./waweb/manager')
const bcrypt = require("bcrypt")
const createApp = require("./app")

db.dbConnect()

const manager = new ManagerWaweb()
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


io.on('connection', (socket, next) => {
    socket.emit('message', 'Connected to server. Please, create a client')

    socket.on('create-session', async ({ user, password, number }) => {
        socket.emit('log', `create-session`)

        const userData = await db.UserModel.findOne({ user, number }).populate('session')

        if (userData === null) {
            socket.emit('log', `no user with user: ${user} and number: ${number}`)

            const err = new Error("user not found")
            err.data = { detail: `no user with user: ${user} and number: ${number}` } // additional details
            next(err)
            // return
        }

        if (!bcrypt.compareSync(password, userData.password)) {
            socket.emit('log', `login failed`)

            const err = new Error("password wrong")
            err.data = { detail: `login failed` } // additional details
            next(err)
            // return
        }

        socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`)

        const client = manager.createClient(userData)

        client.setEmitter(socket)
        manager.pushClient(client)
        socket.emit('log', `creating client...`)

    })

})


let port = process.env.PORT || 5555
server.listen(port, function () {
    console.log('App running on *: ' + port)
})
