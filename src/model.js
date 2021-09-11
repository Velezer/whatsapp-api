const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionModel = mongoose.model('Session', new Schema(
    {
        session: Schema.Types.Mixed
    },
))



module.exports = { SessionModel }