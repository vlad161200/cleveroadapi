const {Router} = require('express');
const router = Router();
const jwt = require('../tools/jwt');


router.get('/', (req, res) => {
    try {
        const decodedToken = jwt.decodeToken(req.headers.authorization);
        res.status(200).json({
                id: decodedToken.id,
                phone: decodedToken.phone,
                name: decodedToken.name,
                email: decodedToken.email
            }
        );
    } catch (error) {
        res.status(401).json({});
    }
});

module.exports = router;