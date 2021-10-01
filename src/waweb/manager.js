const ClientWaweb = require('./client')

class ManagerWaweb {

    constructor() {
        this.clients = []
        this._destroyClients()
    }

    /**
     * @todo destroy unused clients
     */
    _destroyClients() {
        setInterval(() => {
            for (let i = 0; i < this.clients.length - 1; i++) {
                if (this.clients[i].isReady === true) { continue }
                this.clients[i].destroy()
                this.clients.splice(i, 1)
                i--
            }

            setTimeout(() => {
                const last = this.clients.length - 1 // last index
                if (last >= 0 && this.clients[last].isReady === false) {
                    this.clients[last].destroy()
                    this.clients.splice(last, 1)
                }
            }, 1000 * 60 * 2);

            // console.log(`active clients: ${this.clients.length}`)
        }, 1000 * 60 * 5);
    }

    /**
     * @param {object} userData must contain session
     * @todo create client
     * @returns {ClientWaweb} client
     */
    createClient(userData) {
        return new ClientWaweb(userData)
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
            if (client.userData._id == null) { continue }
            if (client.userData._id.toString() == _id) {
                return client
            }
        }
    }




}

module.exports = ManagerWaweb
