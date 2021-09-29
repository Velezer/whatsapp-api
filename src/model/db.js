
const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

mongoose.connect(process.env.DB_URI_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log(`connected db`)
    })
    .catch(err => console.error(err))


const UserModel = require('./user')
const ContactsModel = require('./contacts')

module.exports = { UserModel, ContactsModel }