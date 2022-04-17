
interface MessageParams {
  FromUserName?: string;
  ToUserName?: string;
  reply?: string;
  mediaId?: string;
  title?: string;
  description?: string;
  articles?: any[]
}
// 回复文本消息
export function textMessage(message: MessageParams) {
  var createTime = new Date().getTime();
  return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${message.reply}]]></Content>
    </xml>`;
};
// 回复图片消息
export function imageMessage(message: MessageParams) {
  var createTime = new Date().getTime();
  return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[image]]></MsgType>
    <Image>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
    </Image>
    </xml>`;
};
// 回复语音消息
export function voiceMessage(message: MessageParams) {
  var createTime = new Date().getTime();
  return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[voice]]></MsgType>
    <Voice>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
    </Voice>
    </xml>`;
};
// 回复视频消息
export function videoMessage(message: MessageParams) {
  var createTime = new Date().getTime();
  return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[video]]></MsgType>
    <Video>
        <MediaId><![CDATA[${message.mediaId}]]></MediaId>
        <Title><![CDATA[${message.title}]]></Title>
        <Description><![CDATA[${message.description}]]></Description>
    </Video>
    </xml>`;
};
// 回复图文消息
export function articleMessage(message: MessageParams) {
  var createTime = new Date().getTime();
  return `<xml>
    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    <CreateTime>${createTime}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <ArticleCount>${message.articles && message.articles.length}</ArticleCount>
    <Articles>
        ${message.articles && message.articles
      .map(
        (article) =>
          `<item><Title><![CDATA[${article.title}]]></Title>
                <Description><![CDATA[${article.description}]]></Description>
                <PicUrl><![CDATA[${article.img}]]></PicUrl>
                <Url><![CDATA[${article.url}]]></Url></item>`
      )
      .join("")}
    </Articles>
    </xml>`;
};