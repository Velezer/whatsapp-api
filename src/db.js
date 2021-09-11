
const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

mongoose.connect(process.env.DB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log(`connected db`)
    //     const { SessionModel } = require('./model')

    //     let data={ session: { id: `idididiuudidid` } }
    //     const sessionModel = new SessionModel(data)
    //     let session = await sessionModel.save()
    //     console.log(session)
    //     console.log(`________________________________________`)

    //     session = await SessionModel.findOne(data)
    //     console.log(session)

    })
    .catch(err => console.error(err))