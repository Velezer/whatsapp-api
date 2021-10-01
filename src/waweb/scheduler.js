
class Scheduler {
    /**
     * destroy unused client-waweb
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

            setTimeout(() => {
                const last = manager.clients.length - 1 // last index
                if (last >= 0 && manager.clients[last].isReady === false) {
                    manager.clients[last].destroy()
                    manager.clients.splice(last, 1)
                }
            }, 1000 * 60 * 2);

            // console.log(`active clients: ${manager.clients.length}`)
        }, 1000 * 60 * 5);
    }
}

module.exports = Scheduler