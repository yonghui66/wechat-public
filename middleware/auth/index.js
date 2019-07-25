const sha1 = require('sha1');
const config = require('../../config');
const {
  getUserData,
  parseXMLData,
  formatMessage
} = require('../../utils/tool');
const template = require('./template');

// sha1 加密方式
// 本地需要自己生成signature 跟微信服务器发过来的进行比对，只有相同才能使用

module.exports = async (req, res, next) => {
  const { signature, echostr, timestamp, nonce } = req.query;
  const { token } = config;

  const arr = [timestamp, nonce, token];
  const sha1Str = sha1(arr.sort().join(''));

  if (req.method === 'GET') {
    if (sha1Str === signature) {
      res.send(echostr);
    } else {
      res.end('error');
    }
  } else if (req.method === 'POST') {
    if (sha1Str !== signature) res.end('error');

    const data = await getUserData(req);
    // <xml><ToUserName><![CDATA[gh_3f8212400518]]></ToUserName> 开发者id
    // <FromUserName><![CDATA[ohWDNwmvCNWD6_XWuovW2Eq9MaF0]]></FromUserName> openid
    // <CreateTime>1564041063</CreateTime> 发送的时间戳
    // <MsgType><![CDATA[text]]></MsgType> 消息类型
    // <Content><![CDATA[3223]]></Content> 消息内容
    // <MsgId>22391685007463242</MsgId> 消息id 微信会保存3天的消息，可以根据id进行获取
    // </xml>
    // 解析为js对象
    const jsData = await parseXMLData(data);
    // 格式化
    const message = formatMessage(jsData);
    // 自动回复消息
    let content = '不好意思，暂时无法识别您的内容';
    // 判断为文本消息
    if (message.MsgType === 'text') {
      if (message.Content === '1') content = '吃鸡咯！';
      else if (message.Content === '2') content = '突突突突突突吃鸡咯！';
      // 半匹配回复
      else if (message.Content.match('爱')) content = '爱爱爱爱吃鸡咯！';
    }

    // tousername 发送给谁  跟接受的相反
    // 标签里面不要有多余空格
    const replyMessage = `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
    </xml>`;

    // const replyMessage = template(type)

    console.log(replyMessage);
    // 如果没有响应，微信会发送三次
    res.send(replyMessage);
  } else res.end('error');
};
