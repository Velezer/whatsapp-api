


// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    // eslint-disable-next-line no-undef
    if(process.env.NODE=='production'){
        console.error(err.stack)
    }
    err.code = err.code || 500

    res.status(err.code).json({ message: err.message })
}