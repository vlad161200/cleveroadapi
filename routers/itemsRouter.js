const {Router} = require('express');
const router = Router();
const mysqlConfig = require('../tools/mysql');

router.get('/', async (req, res) => {
    const connection = mysqlConfig.connection();
    await connection.query(`SELECT items.id, items.created_at, items.title, 
    items.price, items.image, items.user_id, users.id, users.phone,
     users.name, users.email FROM items JOIN users ON items.user_id=users.id`, (error, result) => {
            if (error) {

            } else {
                const returnResult = [];
                for (let i = 0; i < result.length; i++) {
                    let tempObject = {
                        id: result[i].id,
                        created_at: result[i].created_at,
                        title: result[i].title,
                        price: result[i].price,
                        image: result[i].image,
                        user_id: result[i].user_id,
                        user: {
                            id: result[i].user_id,
                            phone: result[i].phone,
                            name: result[i].name,
                            email: result[i].email
                        }
                    };
                    returnResult.push(tempObject);
                }
                connection.end();
                res.status(200).json(returnResult);
            }
        }
    );
});

router.get('/:id', async (req, res) => {
    const connection = mysqlConfig.connection();
    await connection.query(`SELECT items.id, items.created_at, items.title, 
    items.price, items.image, items.user_id, users.id, users.phone,
     users.name, users.email FROM items JOIN users ON items.user_id=users.id WHERE items.id = ${req.params.id}`, (error, result) => {
            if (error) {

            } else {
                if (result.length) {
                    let returnResult = {
                        id: result[0].id,
                        created_at: result[0].created_at,
                        title: result[0].title,
                        price: result[0].price,
                        image: result[0].image,
                        user_id: result[0].user_id,
                        user: {
                            id: result[0].user_id,
                            phone: result[0].phone,
                            name: result[0].name,
                            email: result[0].email
                        }
                    };
                    connection.end();
                    res.status(200).json(returnResult);
                } else {
                    res.status(404).json({});
                }
            }
        }
    );
});

module.exports = router;