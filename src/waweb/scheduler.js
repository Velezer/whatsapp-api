
class Scheduler {
    /**
     * destroy unused client-waweb
     * but don't destroy last client
     * 
     * @param {ManagerWaweb} manager 
     */
    static destroyClient(manager) {
        setInterval(() => {
            for (let i = 1; i < manager.clients.length; i++) {
                if (manager.clients[i]._id !== null) { break }
                manager.clients[i].destroy()
                manager.clients.splice(i, 1)
                i--
            }

            console.log(`active clients: ${manager.clients.length}`)
            for (let i = 0; i < manager.clients.length; i++) {
                const client = manager.clients[i];
                console.log(`--- client: ${client._id}`)
            }
        }, 1000 * 60 * 2);
    }
}

module.exports = Scheduler