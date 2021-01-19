const mysql = require('mysql');
const keys = require('../config/keys');


const connection = function () {
    return mysql.createConnection({
        host: keys.host,
        database: keys.database,
        user: keys.user,
        password: keys.password
    });
}
module.exports.connection = connection;