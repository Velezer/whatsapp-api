const { manager } = require('../../waweb/manager')
const { UserModel } = require('../../model/user')

class Helper {
    /**
     * 
     * @param {Object} { user, password, number } 
     * @returns {Object} {client, err}
     */
    static async getClient({ user, password, number }) {
        console.log({ user, password, number })
        const userData = await UserModel.findOne({ user, password, number })
        console.log(userData)
        const client = manager.getClientByUserID(userData._id)
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