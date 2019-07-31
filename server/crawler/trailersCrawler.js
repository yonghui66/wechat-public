const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/coming';

module.exports = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    ignoreDefaultArgs: ['--disable-extensions'],
    headless: true // 无头浏览器的形式打开页面，true为没有页面在后台打开
  });
  // 创建标签页
  const page = await browser.newPage();
  // 跳转到指定网址
  await page.goto(url, {
    waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
  });
  // 延时器，延时后再开始爬虫数据
  await timeout();
  // 爬取列表
  const result = await page.evaluate(() => {
    // 对加载好的页面进行操作
    const $list = $('.coming_list tbody tr');

    const result = [];

    for (let index = 0; index < $list.length; index++) {
      const element = $($list[index]).children('td');
      const people = element
        .last()
        .html()
        .split('人')[0];
      if (people > 1000) {
        result.push({
          date: element
            .eq(0)
            .html()
            .replace(/\s+/g, ''),
          href: element
            .eq(1)
            .children('a')
            .attr('href'),
          name: element
            .eq(1)
            .children('a')
            .html(),
          type: element
            .eq(2)
            .html()
            .replace(/\s+/g, ''),
          area: element
            .eq(3)
            .html()
            .replace(/\s+/g, ''),
          people: element
            .eq(4)
            .html()
            .split('人')[0]
            .replace(/\s+/g, '')
        });
      }
    }
    // 返回数据
    return result;
  });
  // 爬取详情
  for (let index = 0; index < result.length; index++) {
    const res = result[index];

    await page.goto(res.href, {
      waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
    });
    const itemResult = await page.evaluate(async () => {
      const title = $('[property="v:itemreviewed"]').html();
      const pd = $('[rel="v:directedBy"]').html();
      const image = $('[rel="v:image"]').html();
      const starring = [];
      $('[rel="v:starring"]').map((index, el) => starring.push(el.innerHTML));
      const property = $('[property="v:initialReleaseDate"]').html();
      const related = $('.related-pic-video').attr('href');
      const related_image = $('.related-pic-video').attr('background-image');
      const doubanid = $('.a_show_login.lnk-sharing').attr('share-id');

      return {
        doubanid,
        image,
        title,
        pd,
        starring,
        property,
        related,
        related_image
      };
    });

    result[index] = { ...result[index], ...itemResult };
  }
  // 爬取预告片
  for (let index = 0; index < result.length; index++) {
    const data = result[index];
    await page.goto(data.related, {
      waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
    });
    const vedio_url = await page.evaluate(
      () => $('video>source').attr('src') || ''
    );
    result[index] = { ...result[index], vedio_url };
  }
  // 关闭浏览器
  await browser.close();

  return result;
};

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}
