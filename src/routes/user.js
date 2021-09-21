const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/api/user', Validator.user.common, (req, res) => Handler.user.create(req, res))
router.post('/api/user', Validator.user.common, (req, res) => Handler.user.delete(req, res))
router.put('/api/user/contacts', Validator.user.contact, (req, res) => Handler.user.pushContact(req, res))
router.delete('/api/user/contacts', Validator.user.contact, (req, res) => Handler.user.deleteContact(req, res))
router.get('/api/user/contacts', Validator.user.common, (req, res) => Handler.user.showContacts(req, res))


module.exports = router