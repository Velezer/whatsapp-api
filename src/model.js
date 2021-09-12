const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionModel = mongoose.model('Session', new Schema(
    {
        // session: Object
        // session: Schema.Types.Mixed
        session: {
            WABrowserId: String,
            WASecretBundle: String,
            WAToken1: String,
            WAToken2: String
        }
    },
))


module.exports = { SessionModel }