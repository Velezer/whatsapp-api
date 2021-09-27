const router = require("express").Router()
const Handler = require('../handler/handler').waweb
const { Validator } = require('../validation/validator')

router.use(Handler.getClientMiddleware)

router.post('/send-message', Validator.waweb.sendMessage, Handler.sendMessage)
router.post('/send-media', Validator.waweb.sendMedia, Handler.sendMedia)
router.post('/get-contacts', Validator.user.common, Handler.getContacts)


module.exports = router