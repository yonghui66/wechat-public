const express = require('express');
const app = express();
const auth = require('./middleware/auth');

app.use(auth);

app.listen(3000, () => console.log('start'));
