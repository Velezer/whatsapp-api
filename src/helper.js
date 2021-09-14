const { manager } = require('./client-waweb')


class Helper {
    static getClient(_id) {
        const client = manager.getClient(_id)
        if (client == undefined) {
            return { client: null, err: `no client with _id ${_id}. create a client first` };
        }
        if (client.isDestroyed) {
            manager.destroyClient(_id)
            return { client: null, err: `client is disconnected` };
        }
        if (!client.isReady) {
            return { client: null, err: `client is not ready. please, wait for a minute` };
        }
        return { client, err: null }
    }

}

module.exports = { Helper }