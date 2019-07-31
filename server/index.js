const db = require('../db');
const trailersCrawler = require('./crawler/trailersCrawler');
const theateersCrawler = require('./crawler/theateersCrawler');
const saveTheaters = require('./save/saveTheaters');
const saveTrailers = require('./save/saveTrailers');
const Trailers = require('../model/trailers');
const Theaters = require('../model/theaters');
const qiniu = require('./qiniu');

(async function() {
  await db;
  // 爬取数据
  const result = await theateersCrawler();

  // saveTheaters(result);
  // qiniu('postKey',Theaters);

  // const result2 = await trailersCrawler();
  // console.log(result2);

  // saveTrailers(result2);

  // qiniu('postKey', Trailers);
  // qiniu('coverkey', Trailers);
  // qiniu('vedioKey', Trailers);
})();
