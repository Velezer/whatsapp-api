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
     * 
     * @param {string} _id can be get from UserModel
     * @returns 
     */
    getClientByUserID(_id) {
        for (let i = 0; i < this.clients.length; i++) {
            const client = this.clients[i];
            console.log(client.userData._id)
            if (client.userData._id == null) { continue }
            if (client.userData._id.toString() == _id) {
                return client
            }
        }
    }




}

const manager = new ManagerWaweb()
module.exports = { manager }
