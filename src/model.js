const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionModel = mongoose.model('Session', new Schema(
    {
        user: String,
        session: Schema.Types.Mixed
    },
))



module.exports = { SessionModel }