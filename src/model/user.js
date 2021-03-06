const mongoose = require('mongoose')
const SessionModel= require('./session')
const ContactsModel = require('./contacts')

const Schema = mongoose.Schema

const UserModel = mongoose.model('User', new Schema(
    {
        number: {// phone number
            type: String,
            required: [true, 'number is required'],
            unique: [true, 'number already exist'],
            index: true
        },
        user: {
            type: String,
            required: [true, 'user is required'],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
        },
        session: {// phone number
            type: Schema.Types.ObjectId,
            required: [true, 'session is required'],
            ref: 'Session'
        },
        contacts: {// phone number
            type: Schema.Types.ObjectId,
            required: [true, 'contacts is required'],
            ref: 'Contacts'
        },

    },
))

/**
 * 
 * @param {String} user 
 * @param {String} password 
 * @param {String} number 
 * @returns result
 */
UserModel.createUser = async ({ user, password, number }) => {
    const sessionData = new SessionModel({ session: {} })
    const resS = await sessionData.save()
    const contactsData = new ContactsModel({ contacts: [] })
    const resC = await contactsData.save()
    const userData = new UserModel({ user, password, number, session: resS._id, contacts: resC._id })
    return await userData.save()
}

module.exports = UserModel