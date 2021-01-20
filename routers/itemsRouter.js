const {Router} = require('express');
const router = Router();
const multer = require('multer');

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1024 * 1024
    }
}).single('file');


const fs = require('fs');
const path = require('path');


const mysqlConfig = require('../tools/mysql');
const jwt = require('../tools/jwt');
const keys = require('../config/keys');

router.get('/', async (req, res) => {
    const connection = mysqlConfig.connection();
    await connection.query(`SELECT items.id, items.created_at, items.title, 
    items.price, items.image, items.user_id, users.id as "user_id", users.phone,
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
    items.price, items.image, items.user_id, users.id as "user_id", users.phone,
     users.name, users.email FROM items JOIN users ON items.user_id=users.id 
     WHERE items.id = ${req.params.id}`, (error, result) => {
            if (error) {

            } else {
                console.log(result);
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

router.put('/:id', async (req, res) => {
    try {
        const decodedToken = jwt.decodeToken(req.headers.authorization);
        const connection = mysqlConfig.connection();
        await connection.query(`SELECT items.id, items.created_at, items.title,
            items.price, items.image, items.user_id, users.phone,
            users.name, users.email FROM items JOIN users ON items.user_id=users.id 
            WHERE items.id = ${req.params.id}`, async (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (!result.length) {
                    return res.status(404).json({});
                } else {
                    if (decodedToken.id === result[0].user_id && decodedToken.email === result[0].email) {
                        await connection.query(`UPDATE ITEMS SET 
                        title = "${req.body.title || result[0].title}", 
                        price = ${req.body.price || result[0].price}, 
                        image = "${req.body.image || result[0].image}"
                         WHERE id = ${req.params.id};`,
                            async (error, resultOfUpdate) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    await connection.query(`SELECT items.id, items.created_at, items.title,
                                         items.price, items.image, items.user_id, users.phone,
                                         users.name, users.email FROM items JOIN users ON items.user_id=users.id 
                                         WHERE items.id = ${req.params.id}`, (error, result) => {
                                        if (error) {
                                            console.error(error)
                                        } else {
                                            let itemAfterUpdate = {
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
                                            return res.status(200).json(itemAfterUpdate);
                                        }
                                    });
                                }
                            });

                    } else {
                        return res.status(403).json({});
                    }
                }
            }
        });
    } catch (error) {
        return res.status(401).json({});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const decodedToken = jwt.decodeToken(req.headers.authorization);
        const connection = mysqlConfig.connection();
        await connection.query(`SELECT items.id, items.created_at, items.title,
            items.price, items.image, items.user_id, users.phone,
            users.name, users.email FROM items JOIN users ON items.user_id=users.id 
            WHERE items.id = ${req.params.id}`, async (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (!result.length) {
                    return res.status(404).json({});
                } else {
                    if (decodedToken.id === result[0].user_id && decodedToken.email === result[0].email) {
                        await connection.query(`DELETE FROM items WHERE id = ${req.params.id}`,
                            (error, result) => {
                                if (error) {
                                    console.error(error)
                                } else {
                                    return res.status(200).json({});
                                }
                            })

                    } else {
                        return res.status(403).json({});
                    }
                }
            }
        });
    } catch (error) {
        return res.status(401).json({});
    }
});

router.post('/', async (req, res) => {
    if (req.body.title === undefined || req.body.price === undefined) {
        if (req.body.title === undefined) {
            return res.status(422).json({
                field: 'title',
                message: 'Title is required'
            });
        } else {
            return res.status(422).json({
                field: 'price',
                message: 'Price is required'
            });
        }
    }
    if (req.body.title.length < 3) {
        return res.status(422).json({
            field: 'title',
            message: 'Title is less than 3 symbols'
        });
    }
    try {
        const decodedToken = jwt.decodeToken(req.headers.authorization);
        const connection = mysqlConfig.connection();
        const timestamp = Math.floor(Date.now() / 1000);
        await connection.query(`INSERT INTO items VALUES(
               default, "${timestamp}", "${req.body.title}", ${req.body.price}, "${req.body.image}", ${decodedToken.id});`,
            async (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    await connection.query(`SELECT items.id, items.created_at, items.title,
                                         items.price, items.image, items.user_id, users.phone,
                                         users.name, users.email FROM items JOIN users ON items.user_id=users.id 
                                         WHERE items.title="${req.body.title}" AND items.user_id=${decodedToken.id};`,
                        (error, result) => {
                            if (error) {
                                console.error(error)
                            } else {
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
                                return res.status(200).json(returnResult);
                            }
                        });
                }
            });

    } catch (e) {
        return res.status(401).json({});
    }
});

router.post('/:id/images', async (req, res) => {
    try {
        const decodedToken = jwt.decodeToken(req.headers.authorization);
        const connection = mysqlConfig.connection();
        await connection.query(`SELECT items.id, items.created_at, items.title,
            items.price, items.image, items.user_id, users.phone,
            users.name, users.email FROM items JOIN users ON items.user_id=users.id 
            WHERE items.id = ${req.params.id}`, async (error, result) => {
            if (error) {
                console.error(error)
            } else {
                if (decodedToken.id !== result[0].user_id) {
                    res.status(403).json({});
                } else {
                    await upload(req, res, async (error) => {
                        if (error) {
                            return res.status(422).json({
                                field: 'file',
                                message: `The file is too big.`
                            });
                        } else {
                            if (req.file === undefined) {
                                return res.status(422).json({
                                    field: 'file',
                                    message: `There is no file.`
                                });
                            }
                            fs.rename(path.join(__dirname, '..', '/images', `${req.file.filename}`),
                                path.join(__dirname, '..', '/images', `${req.file.filename}.jpg`),
                                (error) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                });
                            await connection.query(`UPDATE items 
                                        SET image="${keys.urlSite}/images/${req.file.filename}.jpg"
                                        WHERE id = ${req.params.id}`, async (error) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    await connection.query(`SELECT items.id, items.created_at, items.title,
                                 items.price, items.image, items.user_id, users.phone,
                                 users.name, users.email FROM items JOIN users ON items.user_id=users.id 
                                 WHERE items.id = ${req.params.id}`, (error, result) => {
                                        if (error) {
                                            console.error(error)
                                        } else {
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
                                            return res.status(200).json(returnResult);
                                        }
                                    });
                                }
                            });
                        }
                    });

                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({});
    }
});


module.exports = router;