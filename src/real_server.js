const db = require('./model/db')
const bcrypt = require("bcrypt")
const ManagerWaweb = require('./waweb/manager')
const createServer = require("./ioServer")


const manager = new ManagerWaweb()
const server = createServer(db, bcrypt, manager)

// eslint-disable-next-line no-undef
let port = process.env.PORT || 5555
server.listen(port, function () {
    console.log('App running on *: ' + port)
})
