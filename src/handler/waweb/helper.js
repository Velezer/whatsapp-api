const { manager } = require('../../waweb/manager')
const { UserModel } = require('../../model/user')

class Helper {
    /**
     * 
     * @param {Object} { user, password, number } 
     * @returns {Object} {client, err}
     */
    static async getClient({ user, password, number }) {
        const res = await UserModel.findOne({ user, password, number })
        const client = manager.getClient(res._id)
        if (client == undefined) {
            return { client: null, err: `no client with user ${user} and number ${number}. create a client first` };
        }
        if (!client.isReady) {
            return { client: null, err: `client with user ${user} and number ${number} is not ready. please, wait for a minute` };
        }
        return { client, err: null }
    }

}

module.exports = { Helper }