const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const theaters = new Schema({
  detail: String,
  image: String,
  name: String,
  num: String,
  postKey: String, // 图片上传到七牛中的返回key值
  createTime: {
    type: Date,
    default: Date.now()
  }
});

const Theaters = mongoose.model('Theaters', theaters);

module.exports = Theaters;
