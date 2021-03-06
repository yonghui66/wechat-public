/**
 * 微信自动回复模板
 * @param {object} options
 * @returns {xml}
 */
module.exports = options => {
  let inner = '<Content><![CDATA[不好意思，暂时无法识别您的内容]]></Content>';
  switch (options.msgType) {
    // 回复文本消息
    case 'text':
      inner = `<Content><![CDATA[${options.content}]]></Content>`;
      break;
    // 回复图片消息
    case 'image':
      inner = `<Image>
      <MediaId><![CDATA[media_id]]></MediaId>
    </Image>`;
      break;
    // 回复语音消息
    case 'voice':
      inner = `<Voice>
      <MediaId><![CDATA[media_id]]></MediaId>
    </Voice>`;
      break;
    // 回复视频消息
    case 'video':
      inner = `<Video>
      <MediaId><![CDATA[media_id]]></MediaId>
      <Title><![CDATA[title]]></Title>
      <Description><![CDATA[description]]></Description>
    </Video>`;
      break;
    // 回复音乐消息
    case 'music':
      inner = `<Music>
      <Title><![CDATA[TITLE]]></Title>
      <Description><![CDATA[DESCRIPTION]]></Description>
      <MusicUrl><![CDATA[MUSIC_Url]]></MusicUrl>
      <HQMusicUrl><![CDATA[HQ_MUSIC_Url]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[media_id]]></ThumbMediaId>
    </Music>`;
      break;
    // 回复图文消息
    case 'news':
      inner = `<ArticleCount>${options.content.length}</ArticleCount>
      <Articles>
        ${options.content.map(
          item => `<item>
        <Title><![CDATA[${item.title}]]></Title>
        <Description><![CDATA[${item.description}]]></Description>
        <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
        <Url><![CDATA[${item.url}]]></Url>
      </item>`
        )}
      </Articles>`;

      console.log(inner)
      break;
  }
  return `<xml>
  <ToUserName><![CDATA[${options.fromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${options.toUserName}]]></FromUserName>
  <CreateTime>${options.createTime}</CreateTime>
  <MsgType><![CDATA[${options.msgType}]]></MsgType>
  ${inner}
  </xml>`;
};
