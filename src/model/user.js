const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserModel = mongoose.model('User', new Schema(
    {
        user: String,
        password: String,
        number: String,   // phone number
        contacts: [
            {
                number: String,
                name: String,
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
UserModel.pushContact = async (_id, contact) => {
   return await UserModel.findByIdAndUpdate(_id, { 
        $push: { contacts: contact } 
    })
}



module.exports = { UserModel }