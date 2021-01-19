const express = require('express');
const registerRouter = require('./routers/registerRouter');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/register', registerRouter);


console.log(PORT);
app.listen(PORT);
