const fs = require("fs");
const path = require("path");
const http = require("axios");
import alarmConfig from "../../alarm-config";
const fileUrl = path.resolve(__dirname, "../tonken.json");
let INTERTIME = (7200 - 60) * 1000; // 设置一个默认的定期获取tonken的时间

// 保存Tonken
export function setTonken() {
  return new Promise((resolve, reject) => {
    http
      .get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${alarmConfig.wechat.APPID}&secret=${alarmConfig.wechat.APPSECRET}`
      )
      .then((res) => {
        // 更新tonken的过期时间，每隔这个时间重新获取一次tonken
        INTERTIME = (res.data.expires_in - 60) * 1000;
        // 获取到Tonken后保存到json文件中
        fs.writeFile(
          fileUrl,
          JSON.stringify({
            tonken: res.data.access_token,
          }),
          (err) => {
            // 通知外界Tonken获取成功
            if(err) {
              reject(err)
            }else {
              resolve(1);
            }
          }
        );
      });
  });
}

// 定时获取Tonken
export function timingSetTonken() {
  // 定时刷新tonken
  setInterval(() => {
    setTonken();
  }, INTERTIME);
}

// 获取Tonken
export function getTonken() {
  return new Promise((resolve, reject) => {
    // 从json中读取保存的Tonken
    fs.readFile(fileUrl, (err, data) => {
      // 返回获取到的tonken
      resolve(JSON.parse(data).tonken);
    });
  });
}

