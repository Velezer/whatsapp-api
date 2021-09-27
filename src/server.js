require('./model/db')
const app = require("./app")
const http = require('http');
const socketIO = require('socket.io');
const process = require('process')
const { manager } = require('./waweb/manager')
const { UserModel } = require('./model/user')// put this below db
const bcrypt = require("bcrypt")

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true // false by default
});


io.on('connection', (socket) => {
    socket.emit('message', 'Connecting...');

    socket.on('create-session', async ({ user, password, number }) => {
        socket.emit('log', `create-session`);

        const userData = await UserModel.findOne({ user, number }).populate('session')

        if (userData === null) {
            socket.emit('log', `no user with user: ${user} and number: ${number}`);
            return
        }

        if (!bcrypt.compareSync(password, userData.password)) {
            socket.emit('log', `login failed`);
            return
        }

        socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`);

        const client = manager.createClient(userData.session, userData)

        client.setEmitter(socket)
        manager.pushClient(client)
        socket.emit('log', `creating client...`);

    })

});


let port = process.env.PORT || 5555
server.listen(port, function () {
    console.log('App running on *: ' + port);
});
