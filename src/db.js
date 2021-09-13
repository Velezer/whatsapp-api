
const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

mongoose.connect(process.env.DB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log(`connected db`)
        // const { SessionModel } = require('./model')

        // // let data={ session: { id: `idididiuudidid` } }
        // // const sessionModel = new SessionModel(data)
        // // let session = await sessionModel.save()
        // // console.log(session)
        // console.log(`_________1________________________________________`)

        // let sessionData = await SessionModel.findOne({ _id: `613d657c959f5257d4122081` })
        // console.log(sessionData)
        // console.log(`_________2________________________________________`)

        // sessionData = await SessionModel.findOne({ session: sessionData.session })
        // console.log(sessionData)
        // console.log(`________3________________________________________`)

        // sessionData = await SessionModel.deleteMany({ session: sessionData.session })
        // console.log(sessionData)

    })
    .catch(err => console.error(err))