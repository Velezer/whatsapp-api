const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ContactsModel = mongoose.model('Contacts', new Schema(
    {
        contacts: [
            {
                c_name: String,
                c_number: {
                    type: String,
                    // unique: [true, 'c_number already exist'],
                },
                // pushname: String,
                // shortName: String,
                // verifiedName: String
            }
        ]

    },
))

/**
 * 
 * @param {string} _id 
 * @param {object} contact 
 * @returns 
 */
 ContactsModel.pushContact = async (_id, contact) => {
    return await ContactsModel.updateOne({ _id }, {
        $addToSet: { contacts: contact }
    })
}

/**
 * 
 * @param {string} _id 
 * @param {object} contact 
 * @returns 
 */
 ContactsModel.deleteContact = async (_id, contact) => {
    return await ContactsModel.updateOne({ _id }, {
        $pull: { contacts: contact }
    })
}


module.exports = { ContactsModel }