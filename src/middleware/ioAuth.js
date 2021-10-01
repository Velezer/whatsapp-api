
module.exports = async (socket, next) => {
    const { user, password, number } = socket.handshake.auth
    if (!user || !password || !number) {
        const err = new Error(`validation failed on user, password, and number`)
        err.code = 400
        return next(err)
    }

    const { UserModel } = socket.db
    const userData = await UserModel.findOne({ user, number }).populate('session')

    if (userData === null) {
        socket.emit('log', `no user with user: ${user} and number: ${number}`)

        const err = new Error('user not found')
        err.data = { detail: `no user with user: ${user} and number: ${number}` } // additional details
        return next(err)
    }

    const { bcrypt } = socket
    if (!bcrypt.compareSync(password, userData.password)) {
        socket.emit('log', `login failed`)

        const err = new Error('password wrong')
        err.data = { detail: `login failed` } // additional details
        return next(err)
    }

    socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`)
    socket.emit('ioAuth', `login success`)

    socket.request.userData = userData// send userData to next middleware
    next()
}