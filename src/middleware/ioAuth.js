const { UserModel } = require('./model/user')
const bcrypt = require("bcrypt")


module.exports = async (socket, next) => {
    const { user, password, number } = socket.request

    const userData = await UserModel.findOne({ user, number }).populate('session')

    if (userData === null) {
        socket.emit('log', `no user with user: ${user} and number: ${number}`)

        const err = new Error('user not found')
        err.data = { detail: `no user with user: ${user} and number: ${number}` } // additional details
        next(err)
        // return
    }

    if (!bcrypt.compareSync(password, userData.password)) {
        socket.emit('log', `login failed`)

        const err = new Error('password wrong')
        err.data = { detail: `login failed` } // additional details
        next(err)
        // return
    }

    socket.emit('log', `login with user: ${userData.user} and number: ${userData.number}`)

    socket.request.userData // send userData to next middleware
    next()
}