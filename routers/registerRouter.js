const {Router} = require('express');
const router = Router();
const bcrypt = require('bcrypt');

const keys = require('../config/keys')
const mysqlTool = require('../tools/mysql');
const jwt = require('../tools/jwt');


router.post('/', async (req, res) => {
    const user = req.body;
    const connection = mysqlTool.connection();
    await connection.query(`INSERT INTO users VALUES(
    default, "${user.phone}", "${user.name}", "${user.email}", "${bcrypt.hashSync(user.password, keys.salt)}");`, async (error, result) => {
        if (error) {
            connection.end();
            return res.status(422).json({
                field: 'current_password',
                message: 'Wrong current password'
            });
        } else {
            await connection.query(`SELECT users.id FROM users WHERE email LIKE "${user.email}";`, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    user.id = result[0].id;
                    const token = jwt.generateToken(user, 3600);
                    connection.end();
                    return res.status(200).json({
                        token: token
                    });
                }
            });
        }
    });
});

module.exports = router;