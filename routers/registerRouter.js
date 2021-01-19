const {Router} = require('express');
const router = Router();

const mysqlTool = require('../tools/mysql');
const jwt = require('../tools/jwt');


router.post('/', async (req, res) => {
    const user = req.body;
    const connection = mysqlTool.connection();
    await connection.query(`INSERT INTO users VALUES(
    default, "${user.phone}", "${user.name}", "${user.email}", "${user.password}");`, (error, result) => {
        if (error) {
            connection.end();
            res.status(422).json({
                field: 'current_password',
                message: 'Wrong current password'
            });
        } else {
            const token = jwt.generateToken(user, 3600);
            connection.end();
            res.status(200).json({
                token: token
            });
        }
    });
});

module.exports = router;