
module.exports = async (socket, next) => {
    const { user, password, number } = socket.handshake.auth
    if (!user || !password || !number) {
        const err = new Error(`validation failed on user, password, and number`)
        err.data = { code: 400 }
        return next(err)
    }

    const { UserModel } = socket.db
    const userData = await UserModel.findOne({ user, number }).populate('session')

    if (userData === null) {
        const err = new Error('user not found')
        err.data = { code: 404 }
        return next(err)
    }

    const { bcrypt } = socket
    if (!bcrypt.compareSync(password, userData.password)) {
        const err = new Error('password wrong')
        err.data = { code: 401 }
        return next(err)
    }

    socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`)
    socket.emit('ioAuth', `ioAuth`)

    socket.request.userData = userData// send userData to next middleware
    next()
}