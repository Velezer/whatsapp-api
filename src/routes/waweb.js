const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/send-message', Validator.waweb.sendMessage, Handler.waweb.sendMessage)
router.post('/send-media', Validator.waweb.sendMedia, Handler.waweb.sendMedia)
router.post('/get-contacts', Validator.user.common, Handler.waweb.getContacts)


module.exports = router