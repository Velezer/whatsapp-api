const { body } = require('express-validator');


const validateReqSendMessages = [
    body(`numbers`,`numbers is empty`).notEmpty(),
    body(`numbers`,`can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({min:1}),
    body(`numbers.*`,`not a mobile phone`).isMobilePhone(),

    body(`message`).notEmpty()
]


module.exports = { validateReqSendMessages }