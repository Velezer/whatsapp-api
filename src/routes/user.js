const router = require("express").Router()
const Handler = require('../handler/handler').user
const { Validator } = require('../validation/validator')


// routes for /api/user

// user acccount
router.post('/', Validator.user.common, Handler.create)
router.delete('/', Validator.user.common, Handler.delete)

// user's contacts
router.put('/contacts', Validator.user.contact, Handler.pushContact)
router.delete('/contacts', Validator.user.contact, Handler.deleteContact)
router.get('/contacts', Validator.user.common, Handler.showContacts)


module.exports = router