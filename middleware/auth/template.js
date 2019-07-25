/**
 * 微信自动回复模板
 * @param {object} options
 * @returns {xml}
 */
module.exports = options => {
  let inner = '不好意思，暂时无法识别您的内容';
  switch (options.MsgType) {
    // 回复文本消息
    case 'text':
      inner = `<Content><![CDATA[你好]]></Content>`;
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
      inner = `<ArticleCount>1</ArticleCount>
      <Articles>
        <item>
          <Title><![CDATA[title1]]></Title>
          <Description><![CDATA[description1]]></Description>
          <PicUrl><![CDATA[picurl]]></PicUrl>
          <Url><![CDATA[url]]></Url>
        </item>
      </Articles>`;
      break;
  }

  return `<xml>
  <ToUserName><![CDATA[${options.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${options.ToUserName}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType><![CDATA[${options.MsgType}]]></MsgType>
  ${inner}
  </xml>`;
};
