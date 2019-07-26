module.exports = message => {
  const options = {
    toUserName: message.ToUserName,
    fromUserName: message.FromUserName,
    createTime: Date.now(),
    msgType: 'text'
  };

  // 自动回复消息
  let content = '不好意思，暂时无法识别您的内容';
  // 判断为文本消息
  if (message.MsgType === 'text') {
    if (message.Content === '1') content = '吃鸡咯！';
    else if (message.Content === '2') content = '突突突突突突吃鸡咯！';
    // 半匹配回复
    else if (message.Content.match('爱')) content = '爱爱爱爱吃鸡咯！';
  } else if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      content = '欢迎您的关注！';

      if (message.EventKet) {
        content = '扫描的是带参数的二维码关注事件';
      }
    }
  } else if (message.MsgType === 'unsubscribe') {
    console.log('取消关注');
  }

  options.content = content;

  return options;
};
