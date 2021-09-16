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
            return { client: undefined, code: 404, err: `user isn't registered. please, register` }
        }
        if (password !== userData.password) {
            return { client: undefined, code: 401, err: `password wrong` }
        }
        const client = manager.getClientByUserID(userData._id.toString())
        console.log(`client________________`)
        console.log(client)
        if (client === undefined) {
            return { client: undefined, code: 500, err: `no client with user ${user} and number ${number}. create a client first` };
        }
        if (!client.isReady) {
            return { client: client, code: 500, err: `client with user ${user} and number ${number} is not ready. please, wait for a minute` };
        }
        return { client, code: 200, err: null }
    }

}

module.exports = { Helper }