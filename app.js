const express = require('express');
const app = express();
const auth = require('./middleware/auth');
// 配置目录
app.set('views', './views');
// 配置模板引擎
app.set('view engine', 'ejs');

app.get('/search', (req, res, next) => {
  res.render('search');
});

app.use(auth);

app.listen(3000, () => console.log('start'));
