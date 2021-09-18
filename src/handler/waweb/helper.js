const { manager } = require('../../waweb/manager')
const { UserModel } = require('../../model/user')

class Helper {
    /**
     * 
     * @param {object} { user, password, number } 
     * @returns {object} {client, code,err}
     */
    static async getClient({ user, password, number }) {
        let data = {}
        const userData = await UserModel.findOne({ user, number })
        if (userData === null) {
            data.code = 404
            data.err = `user isn't registered. please, register`
            return data
        }
        if (password !== userData.password) {
            data.code = 401
            data.err = `password wrong`
            return data
        }
        const client = manager.getClientByUserID(userData._id.toString())

        if (client === undefined) {
            data.code = 500
            data.err = `no client with user ${user} and number ${number}. create a client first`
            return data
        }
        if (!client.isReady) {
            data.code = 500
            data.err = `client with user ${user} and number ${number} is not ready. please, wait for a minute`
            return data
        }
        data.client = client
        return data
    }

}

module.exports = { Helper }