const { ClientWaweb } = require('./client')


class ManagerWaweb {

    constructor() {
        this.clients = []
    }

    /**
     * @param {*} sessionData 
     * @todo create client
     * @returns client
     */
    createClient(sessionData) {
        return new ClientWaweb(sessionData)
    }

    /**
     * @param {*} clientWaweb 
     * @todo add client
     */
    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }

    /**
     * @param {string} _id
     * @todo choose client when send-message
     * @returns client
     */
    getClient(_id) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            if (client._id == null) { continue }
            if (client._id.toString() == _id) {
                return client
            }
        }
    }
    /**
     * @param {string} _id 
     * @returns client's index
     */
    getClientIndex(_id) {
        return this.clients.findIndex((client) => {
            if (!client._id == null) {
                return client._id.toString() == _id
            }
        })
    }
    /**
     * @param {String} _id 
     * @todo destroy client
     * @returns client
     */
    destroyClient(_id) {
        const client = this.clients.splice(this.getClientIndex(_id), 1)
        return client
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
