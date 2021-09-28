const { manager } = require('./waweb/manager')


module.exports = async (socket, next) => {

    const userData = socket.request.userData
    const client = manager.createClient(userData)

    client.setEmitter(socket)
    manager.pushClient(client)
    socket.emit('log', `creating client...`)
    socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`)

    next()
}