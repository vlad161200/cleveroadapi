const express = require('express');
const app = express();

const registerRouter = require('./routers/registerRouter');
const loginRouter = require('./routers/loginRouter');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);


console.log(PORT);
app.listen(PORT);
