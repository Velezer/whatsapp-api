
const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

mongoose.connect(process.env.DB_URI_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true })
    // .then(async () => {
    //     console.log(`connected`)
    //     const { SessionModel } = require('./model')

    //     const sessionModel = new SessionModel({ user: 'aku',session:{id:10} })
    //     let session = await sessionModel.save()
    //     console.log(session)

    //     session = await SessionModel.find({ user: `aku` })
    //     console.log(session)

    // })
    .catch(err => console.error(err))