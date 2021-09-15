const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserModel = mongoose.model('User', new Schema(
    {
        user: {
            type: String,
            required: [true, 'user is required'],
            unique: [true, 'that user is taken']
        },
        password: String,
        number: String,   // phone number
        contacts: [
            {
                name: String,
                number: {
                    type: String,
                    required: [true, 'number is required'],
                    unique: [true, 'number already exist']
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
UserModel.pushContact = async (_id, contact) => {
    return await UserModel.findByIdAndUpdate(_id, {
        $push: { contacts: contact }
    })
}



module.exports = { UserModel }