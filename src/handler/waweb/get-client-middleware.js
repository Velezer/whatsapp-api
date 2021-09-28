const { manager } = require('../../waweb/manager')

module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel } = req.db

    const userData = await UserModel.findOne({ user, number })
    if (userData === null) {
        const err = new Error(`user isn't registered. please, register`)
        err.code = 404
        next(err)
    }
    if (password !== userData.password) {
        const err = new Error(`password wrong`)
        err.code = 401
        next(err)
    }
    
    const client = manager.getClientByUserID(userData._id.toString())

    if (client === undefined) {
        const err = new Error(`no client with user ${user} and number ${number}. create a client first`)
        err.code = 500
        next(err)
    }
    if (!client.isReady) {
        const err = new Error(`client with user ${user} and number ${number} is not ready. please, wait for a minute`)
        err.code = 500
        next(err)
    }

    req.client = client
    next()

}