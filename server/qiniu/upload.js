const qiniu = require('qiniu');

const accessKey = 'dSKG1M50pszNFsBqse1VbTxSp9FPN6Ox55S-e3S5';
const secretKey = 'a0TWgrrHE-JBwmkao1AeVcGk637kS_f78-HzyPgN';
// 定义鉴权
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// 配置对象
const config = new qiniu.conf.Config();
// 存储区域 z2 -- 华南
config.zone = qiniu.zone.Zone_z2;
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const bucket = 'ds';

/**
 * 上传文件到七牛云
 * 资源地址 resUrl
 * 存储空间名称 bucket
 * 重命名 key 唯一的
 */
module.exports = (resUrl, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
        //throw err;
      } else {
        if (respInfo.statusCode == 200) {
          console.log('文件上传成功');
          console.log(respBody.key);
          console.log(respBody.hash);
          console.log(respBody.fsize);
          console.log(respBody.mimeType);
          resolve();
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          reject();
        }
      }
    });
  });
};
