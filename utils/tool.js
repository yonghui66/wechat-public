const { parseString } = require('xml2js');

module.exports = {
  getUserData(req) {
    return new Promise((resolve, reject) => {
      let xmdData = '';
      // 传入流式数据
      req
        .on('data', data => {
          // 获取回来时buffer 需要转化成字符串
          xmdData += data.toString();
        })
        .on('end', () => {
          resolve(xmdData);
        });
    });
  },
  // xml转化
  parseXMLData(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { trim: true }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  formatMessage(data) {
    const message = {};
    data = data.xml;
    // 判断是否为对象 出错时返回的不是一个对象
    if (typeof data === 'object') {
      for (const key in data) {
        const val = data[key];
        // 过滤空数据
        if (Array.isArray(val) && val.length > 0) {
          message[key] = val[0];
        }
      }
    }

    return message;
  }
};
