const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/coming';

module.exports = async () => {
  const browser = await puppeteer.launch({
    headless: false // 无头浏览器的形式打开页面，true为没有页面在后台打开
  });
  // 创建标签页
  const page = await browser.newPage();
  // 跳转到指定网址
  await page.goto(url, {
    waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
  });
  // 延时器，延时后再开始爬虫数据
  await timeout();

  const result = await page.evaluate(() => {
    // 对加载好的页面进行操作
    const $list = $('.coming_list tbody tr');

    const result = [];

    for (let index = 0; index < $list.length; index++) {
      const element = $($list[index]).children('td');
      const people = +element
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
  result.length = 1;

  for (let index = 0; index < result.length; index++) {
    const res = result[index];

    await page.goto(res.href, {
      waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
    });
    const itemResult = await page.evaluate(async () => {
      const title = $('[property="v:itemreviewed"]').html();
      const pd = $('[rel="v:directedBy"]').html();
      const starring = [];
      $('[rel="v:starring"]').map((index, el) => starring.push(el.innerHTML));
      const property = $('[property="v:initialReleaseDate"]').html();
      const related = $('.related-pic-video').attr('href');
      const related_image = $('.related-pic-video').attr('background-image');

      return {
        title,
        pd,
        starring,
        property,
        related,
        related_image,
        vedioUrl: vedioResult
      };
    });
    await timeout();
    await page.goto(itemResult.related, {
      waitUntil: 'networkidle2' // 等待网络空闲时，再跳转加载页面
    });
    const vedioUrl = await page.evaluate(() => {
      const is = $('video>source').attr('src') || '';
      return is;
    });

    result[index] = { ...result[index], ...itemResult, vedioUrl: vedioUrl };
  }

  // 关闭浏览器
  await browser.close();

  return result;
};

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}
