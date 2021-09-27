const express = require('express')

const cors = require('cors');
const fileUpload = require('express-fileupload');


const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cors({ credentials: true, origin: true }));


app.get('/', (req, res) => {
  res.status(200).json({
    message: `server up`
  });
})

app.use('/api/waweb', require("./routes/waweb"))
app.use('/api/user', require("./routes/user"))

app.use(require("./middleware/expressError"))







module.exports = app