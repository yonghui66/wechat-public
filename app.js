const express = require('express');
const app = express();
const auth = require('./middleware/reply');
const sha1 = require('sha1');
const Wechat = require('./middleware/wechat');
const { url, appID } = require('./config');
const wt = new Wechat();

// 配置目录
app.set('views', './views');
// 配置模板引擎
app.set('view engine', 'ejs');

app.get('/search', async (req, res, next) => {
  const { ticket } = await wt.fetchTicket();
  const noncestr = `${Math.random()}`.split('.')[1];
  const timestamp = Date.now();
  const signature = sha1(
    `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}/search`
  );
  res.render('search', {
    appID,
    timestamp,
    noncestr,
    signature
  });
});

app.use(auth);

app.listen(3000, () => console.log('start'));
