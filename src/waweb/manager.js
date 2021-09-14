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
        console.log(`clients.length is `, this.clients.length)
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            if (client._id == null) { continue }
            if (client._id.toString() == _id) {
                console.log(`client selected: `, client._id.toString())
                return client
            }
        }
        // return this.clients.find((client) => {
        //     if (!client._id == null) {
        //         return client._id.toString() == _id
        //     }
        // })
    }
    /**
     * @param {string} _id 
     * @returns client's index
     */
    getClientIndex(_id) {
        console.log(`manager clients is ${this.clients.length}`)
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
        return this.clients.splice(this.getClientIndex(_id), 1)
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
