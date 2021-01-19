const express = require('express');
const app = express();

const registerRouter = require('./routers/registerRouter');
const loginRouter = require('./routers/loginRouter');
const meRouter = require('./routers/meRouter');
const itemsRouter = require('./routers/itemsRouter');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/me', meRouter);
app.use('/api/items', itemsRouter);


console.log(PORT);
app.listen(PORT);
