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

/**
 * 
 * @param {String} _id 
 * @param {String} session 
 * @returns 
 */
SessionModel.updateSession = async (_id, session) => {
    return await SessionModel.updateOne({ _id: _id }, {
        $set: { session: session }
    })
}

module.exports = { SessionModel }