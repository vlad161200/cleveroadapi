const {Router} = require('express');
const router = Router();
const mysqlConfig = require('../tools/mysql');
const jwt = require('../tools/jwt');

router.post('/', async (req, res) => {
    const user = req.body;
    const connection = mysqlConfig.connection();
    await connection.query(`SELECT * FROM users WHERE email like "${user.email}"`, (error, result) => {
        if (error) {
            console.error(error);
        } else {
            if (!result.length) {
                connection.end();
                return res.status(422).json({
                    field: 'password',
                    message: 'Wrong email or password'
                });
            } else {
                connection.end();
                if (user.password === result[0].password) {
                    const token = jwt.generateToken(result[0], 3600);
                    return res.status(200).json({
                        token: token
                    });
                } else {
                    return res.status(422).json({
                        field: 'password',
                        message: 'Wrong email or password'
                    });
                }
            }
        }
    });
});

module.exports = router;