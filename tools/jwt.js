const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

let generateToken = function (user, tokenExpire) {
    const token = jwt.sign({
        phone: user.phone,
        name: user.name,
        email: user.email,
    }, keys.secretKey, {expiresIn: tokenExpire});
    return token;
}

module.exports.generateToken = generateToken;