

module.exports = async (socket, next) => {

    const userData = socket.request.userData

    const { manager } = socket
    const client = manager.createClient(userData)

    client.setEmitter(socket)
    manager.pushClient(client)
    socket.emit('log', `creating client...`)
    socket.emit('ioCreateClient', `creating client...`)

    next()
}