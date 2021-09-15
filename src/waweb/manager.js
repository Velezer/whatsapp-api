const { ClientWaweb } = require('./client')
const Scheduler = require('./scheduler')

class ManagerWaweb {

    constructor() {
        this.clients = []
        Scheduler.destroyClient(this)
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
    getClientById(_id) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            if (client._id == null) { continue }
            if (client._id.toString() == _id) {
                return client
            }
        }
    }

    /**
     * 
     * @param {Object} { user, password, number } 
     * @returns 
     */
    getClient({ user, password, number }) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            if (client.user == user &&
                client.password == password &&
                client.number == number) {
                return client
            }
        }
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
