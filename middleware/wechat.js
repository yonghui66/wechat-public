// 获取access_token 唯一 有效2小时，提前五分钟请求刷新过期前
// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
// 首次本地没有token，获取回来后需要保存下来，保存在文件上
// 第二次：先去读取，判断是否过期，过去了重新请求然后覆盖文件
// module.exports = (req, res, next) => {};

// 请求库
// request
// request-promise-native 只需引入它
const api = require('../utils/api');
const fs = require('fs');
const request = require('request-promise-native');
const { appID, appsecret } = require('../config');
const menu = require('./menu');

class wechat_token {
  constructor() {}

  // 获取access_token
  getAccessToken() {
    const url = `${api.accessToken}&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve, reject) => {
      request({ method: 'get', url })
        .then(res => {
          res = JSON.parse(res);
          console.log(typeof res);
          console.log(res);
          console.log('----------------');
          // 设置过期时间  当前时间 + (返回时间 - 五分钟)*1000    *1000才是正确的时间戳
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;

          resolve(res);
        })
        .catch(err => reject(`获取失败 is error:${err}`));
    });
  }

  saveAccessToken(accessToken) {
    return new Promise((resolve, reject) =>
      fs.writeFile(
        '../access_token.txt',
        JSON.stringify(accessToken),
        (err, data) => {
          if (!err) {
            console.log('access_token 保存成功');
            resolve(data);
          } else reject('access_token 保存失败：' + err);
        }
      )
    );
  }

  readAccessToken() {
    return new Promise((resolve, reject) =>
      fs.readFile('../access_token.txt', (err, data) => {
        if (!err) resolve(JSON.parse(data));
        else reject(err);
      })
    );
  }

  // 检测是否有效
  isValidAccessToken(data) {
    if (!data && !data.access_token && !data.expires_in) return false;

    // 大于当前时间表示没有过期返回true
    return data.expires_in > Date.now();
  }

  fetchAccessToken() {
    // 判断之前是否获取过并且没有过期
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      });
    }

    return this.readAccessToken()
      .then(async res => {
        if (this.isValidAccessToken(res)) return Promise.resolve(res);
        else {
          const res = await this.getAccessToken();
          await this.saveAccessToken(res);
          return Promise.resolve(res);
        }
      })
      .catch(async err => {
        const res = await this.getAccessToken();
        await this.saveAccessToken(res);
        return Promise.resolve(res);
      })
      .then(async res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      });
  }

  createMenu(menu) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken();
        const url = `${api.menu.createMenu}?access_token=${data.access_token}`;

        const result = await request({
          url,
          method: 'POST',
          json: true,
          body: menu
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteMenu() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken();
        const url = `${api.menu.deleteMenu}?access_token=${data.access_token}`;
        const result = await request({
          url,
          method: 'POST',
          json: true,
          body: menu
        });
        if (result.errcode === 0) {
          resolve(result);
        } else reject(result.errmsg);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 获取ticket
  async getTicket() {
    const data = await this.fetchAccessToken();
    const url = `${api.ticket}&access_token=${data.access_token}`;
    return new Promise((resolve, reject) => {
      request({ method: 'get', url, json: true })
        .then(res =>
          resolve({
            ticket: res.ticket,
            ticket_expires_in: Date.now() + (res.expires_in - 300) * 1000
          })
        )
        .catch(err => reject(`获取ticket失败 is error:${err}`));
    });
  }

  saveTicket(accessToken) {
    return new Promise((resolve, reject) =>
      fs.writeFile(
        '../access_token.txt',
        JSON.stringify(accessToken),
        (err, data) => {
          if (!err) {
            console.log('access_token 保存成功');
            resolve(data);
          } else reject('access_token 保存失败：' + err);
        }
      )
    );
  }

  readTicket() {
    return new Promise((resolve, reject) =>
      fs.readFile('../access_token.txt', (err, data) => {
        if (!err) resolve(JSON.parse(data));
        else reject(err);
      })
    );
  }

  // 检测是否有效
  isValidTicket(data) {
    if (!data && !data.ticket && !data.ticket_expires_in) return false;

    // 大于当前时间表示没有过期返回true
    return data.ticket_expires_in > Date.now();
  }

  fetchAccessToken() {
    // 判断之前是否获取过并且没有过期
    if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
      return Promise.resolve({
        ticket: this.ticket,
        expires_in: this.ticket_expires_in
      });
    }

    return this.readTicket()
      .then(async res => {
        if (this.isValidTicket(res)) return Promise.resolve(res);
        else {
          const res = await this.getTicket();
          await this.saveTicket(res);
          return Promise.resolve(res);
        }
      })
      .catch(async err => {
        const res = await this.getTicket();
        await this.saveTicket(res);
        return Promise.resolve(res);
      })
      .then(async res => {
        this.ticket = res.ticket;
        this.ticket_expires_in = res.expires_in;
        return Promise.resolve(res);
      });
  }
}

(async function() {
  const w = new wechat_token();
  let result = await w.deleteMenu();
  console.log(result);
  result = await w.createMenu(menu);
  console.log(result);
})();
