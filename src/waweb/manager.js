const { ClientWaweb } = require('./client')
const Scheduler = require('./scheduler')

class ManagerWaweb {

    constructor() {
        this.clients = []
        Scheduler.destroyClient(this)
    }

    /**
     * @param {object} session
     * @param {object} userData
     * @todo create client
     * @returns {ClientWaweb} client
     */
    createClient(session, userData) {
        return new ClientWaweb(session, userData)
    }

    /**
     * @param {ClientWaweb} clientWaweb 
     * @todo add client
     */
    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }

    /**
     * 
     * @param {string} _id can be get from UserModel
     * @returns {ClientWaweb} client
     */
    getClientByUserID(_id) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            console.log(client.userData)
            if (client.userData._id == null) { continue }
            if (client.userData._id.toString() == _id) {
                return client
            }
        }
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
