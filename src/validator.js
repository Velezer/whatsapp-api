const { body } = require('express-validator');


const validateReqSendMessages = [
    body(`numbers`,`can't convert to array`).toArray(),
    body(`numbers`, `array min length is 1`).notEmpty().isArray({min:1}),
    body(`numbers.*`,`not a mobile phone`).isMobilePhone(),
    body(`message`).notEmpty()
]


module.exports = { validateReqSendMessages }