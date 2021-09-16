const { manager } = require('../../waweb/manager')
const { UserModel } = require('../../model/user')

class Helper {
    /**
     * 
     * @param {Object} { user, password, number } 
     * @returns {Object} {client, code,err}
     */
    static async getClient({ user, password, number }) {
        const userData = await UserModel.findOne({ user, number })
        if (userData === null) {
            return { code: 404, err: `user isn't registered. please, register` }
        }
        if (password !== userData.password) {
            return { code: 401, err: `password wrong` }
        }
        const client = manager.getClientByUserID(userData._id.toString())

        if (client === undefined) {
            return { code: 500, err: `no client with user ${user} and number ${number}. create a client first` };
        }
        if (!client.isReady) {
            return { code: 500, err: `client with user ${user} and number ${number} is not ready. please, wait for a minute` };
        }
        return { client: client }
    }

}

module.exports = { Helper }