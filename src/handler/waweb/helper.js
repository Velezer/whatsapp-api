const { manager } = require('../../waweb/manager')


class Helper {
    /**
     * 
     * @param {string} _id 
     * @returns {Object} {client, err}
     */
    static getClient(_id) {
        const client = manager.getClient(_id)
        if (client == undefined) {
            return { client: null, err: `no client with _id ${_id}. create a client first` };
        }
        if (!client.isReady) {
            return { client: null, err: `client with _id ${_id} is not ready. please, wait for a minute` };
        }
        return { client, err: null }
    }

}

module.exports = { Helper }