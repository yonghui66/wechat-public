const db = require('../db');
const trailersCrawler = require('./crawler/trailersCrawler');
const theateersCrawler = require('./crawler/theateersCrawler');
const saveTheaters = require('./save/saveTheaters');
const qiniu = require('./qiniu');

(async function() {
  await db;
  // 爬取数据
  // const result = await theateersCrawler();

  const result2 = await trailersCrawler()
  console.log(result2)

  // saveTheaters(result);

  // qiniu();
})();
