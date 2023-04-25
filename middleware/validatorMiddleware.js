const fs = require('fs');
const { validationResult } = require('express-validator');

// Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleWare = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        };
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = validatorMiddleWare;
