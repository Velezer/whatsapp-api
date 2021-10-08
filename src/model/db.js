
const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()


let DB_URI = process.env.DB_URI

if (process.env.ENVIRONTMENT === 'test') {
    DB_URI = process.env.DB_URI_TEST
}

function dbConnect() {
    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.error(err))
    return mongoose.connection

}

function dbClose() {
    return mongoose.disconnect()
}

const UserModel = require('./user')
const ContactsModel = require('./contacts')

module.exports = { dbConnect, dbClose, UserModel, ContactsModel }