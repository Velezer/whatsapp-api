


class SessionModel {
    constructor(data) {
        this.data = data
    }

    getSessionCfg() {
        return this.sessionCfg
    }

    save() {
        // save sessionCfg
    }

}

module.exports = { SessionModel }