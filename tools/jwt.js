const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

let generateToken = function (user, tokenExpire) {
    return jwt.sign({
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
    }, keys.secretKey, {expiresIn: tokenExpire});
}

let decodeToken = function (token) {
    return jwt.verify(token, keys.secretKey);
}

module.exports.generateToken = generateToken;
module.exports.decodeToken = decodeToken;