const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionModel = mongoose.model('Session', new Schema(
    {
        session: Object
    },
))



module.exports = { SessionModel }