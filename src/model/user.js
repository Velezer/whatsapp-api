const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserModel = mongoose.model('User', new Schema(
    {
        user: {
            type: String,
            required: [true, 'user is required'],
            unique: [true, 'user already exist']
        },
        password: String,
        number: {
            type: String,
            required: [true, 'number is required'],
            unique: [true, 'number already exist']
        },   // phone number
        contacts: [
            {
                c_name: String,
                c_number: {
                    type: String,
                    required: [true, 'c_number is required'],
                    unique: [true, 'c_number already exist']
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
    return await UserModel.updateOne({ _id }, {
        $addToSet: { contacts: contact }
    })
    // return await UserModel.findByIdAndUpdate(_id, {
    //     $addToSet: { contacts: contact }
    // })
}



module.exports = { UserModel }