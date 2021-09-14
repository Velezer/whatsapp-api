class Handler {}

Handler.sendMessage = (req, res) => require('./send-message')(req, res)
Handler.sendMedia = (req, res) => require('./send-media')(req, res)
Handler.getContacts = (req, res) => require('./get-contacts')(req, res)


module.exports = Handler