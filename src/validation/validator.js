const { ExpressFileuploadValidator } = require('express-fileupload-validator');
const { Rules } = require('./rules')
const { validationResult } = require('express-validator');


class ImageFileuploadValidationResult extends ExpressFileuploadValidator {
    constructor(req) {
        super({
            minCount: 1,
            maxCount: 1,
            allowedExtensions: ['jpg', 'png', 'gif'],
            allowedMimetypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
            maxSize: '10MB',
        })
        try {
            this.validate(req.files.file);
        } catch (e) {
            if (req.files == null) this.errors = { file: `no file uploaded` }
            else this.errors = { file: e.errors }
        }
    }
    isEmpty() {
        return (this.errors === {} || this.errors === [] || this.errors === `` || this.errors === undefined || this.errors === null)
    }
    array() {
        return this.errors
    }

}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

const validateImage = (req, res, next) => {
    const fileErrors = new ImageFileuploadValidationResult(req)
    if (!fileErrors.isEmpty()) {
        return res.status(400).json({ errors: fileErrors.array() });
    }
    next()
}

class Validator { }

Validator.waweb = {}
Validator.waweb.sendMessage = [
    ...Rules.numbers,
    ...Rules.message,
    ...Rules.user,
    validate
]
Validator.waweb.sendMedia = [
    ...Rules.numbers,
    ...Rules.caption,
    ...Rules.user,
    validate,
    validateImage
]

Validator.user = {}
Validator.user.common = [
    ...Rules.user,
    validate
]
Validator.user.contact = [
    ...Rules.user,
    ...Rules.contact,
    validate
]




module.exports = { Validator }