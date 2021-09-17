const mongoose = require('mongoose')
const { SessionModel } = require('./session')
const { ContactsModel } = require('./contacts')

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
        session_id: {// phone number
            type: Schema.Types.ObjectId,
            required: [true, 'session_id is required'],
            ref: 'Session'
        },
        contacts_id: {// phone number
            type: Schema.Types.ObjectId,
            required: [true, 'contacts_id is required'],
            ref: 'Contacts'
        },

    },
))

/**
 * 
 * @param {String} user 
 * @param {String} password 
 * @param {String} number 
 * @returns 
 */
UserModel.createUser = async ({ user, password, number }) => {
    const sessionData = new SessionModel({ session: {} })
    const resS = await sessionData.save()
    const contactsData = new ContactsModel({ contacts: [] })
    const resC = await contactsData.save()
    const userData = new UserModel({ user, password, number, session: resS._id, contacts: resC._id })
    return await userData.save()
}

module.exports = { UserModel }