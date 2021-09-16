class Handler { }

Handler.waweb = {}
Handler.waweb.sendMessage = (req, res) => require('./waweb/send-message')(req, res)
Handler.waweb.sendMedia = (req, res) => require('./waweb/send-media')(req, res)
Handler.waweb.getContacts = (req, res) => require('./waweb/get-contacts')(req, res)


Handler.user = {}
Handler.user.create = (req, res) => require('./user/create')(req, res)
Handler.user.pushContact = (req, res) => require('./user/push-contact')(req, res)
Handler.user.showContacts = (req, res) => require('./user/show-contact')(req, res)


module.exports = Handler