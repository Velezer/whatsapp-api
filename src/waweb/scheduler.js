
class Scheduler {
    /**
     * destroy unused client-waweb
     * but don't destroy last client
     * 
     * @param {ManagerWaweb} manager 
     */
    static destroyClient(manager) {
        setInterval(() => {
            for (let i = 0; i < manager.clients.length - 1; i++) {
                if (manager.clients[i].isReady === true) { continue }
                manager.clients[i].destroy()
                manager.clients.splice(i, 1)
                i--
            }

            // console.log(`active clients: ${manager.clients.length}`)
        }, 1000 * 60 * 5);
    }
}

module.exports = Scheduler