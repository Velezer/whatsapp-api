const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/api/waweb/send-message', Validator.waweb.sendMessage, (req, res) => Handler.waweb.sendMessage(req, res))
router.post('/api/waweb/send-media', Validator.waweb.sendMedia, (req, res) => Handler.waweb.sendMedia(req, res))
router.post('/api/waweb/get-contacts', Validator.user.common, (req, res) => Handler.waweb.getContacts(req, res))


module.exports = router