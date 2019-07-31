const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trailers = new Schema({
  detail: String,
  image: String,
  name: String,
  num: String,
  postKey: String, // 图片上传到七牛中的返回key值
  coverkey: String, //预告片封面上传到七牛中的返回key值
  vedioKey: String, // 预告片视频上传到七牛中的返回key值
  doubanid: String,
  image: String,
  title: String,
  pd: String,
  starring: [String],
  property: String,
  related: String,
  related_image: String,
  vedio_url: String,
  createTime: {
    type: Date,
    default: Date.now()
  }
});

const Trailers = mongoose.model('Trailers', trailers);

module.exports = Trailers;
