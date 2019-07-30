const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/explore';

module.exports = async () => {
  const browser = await puppeteer.launch({
    // args:[],
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
    const $list = $('.list-wp > .list > .item');
    console.log($list)
    console.log($list.length)

    const result = [];

    for (let index = 0; index < $list.length; index++) {
      const element = $($list[index]);
      result.push({
        detail: element.attr('href'),
        image: element.find('.cover-wp > img').attr('src'),
        name: element.find('.cover-wp > img').attr('alt'),
        num: element.children('p>strong').innerHTML
      });
    }

    // 返回数据
    return result;
  });
  // 关闭浏览器
  await browser.close();

  return result;
};

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}
