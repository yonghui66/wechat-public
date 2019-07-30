const upload = require('./upload');
const Theaters = require('../../model/theaters');
// 生成唯一key
const nanoid = require('nanoid');

module.exports = async () => {
  // postKey: { $or: [{postKey:''}, {postKey:null}, {postKey:{ $exists: false }}] }

  const result = await Theaters.find({
    postKey: { $in: ['', null] }
  });

  for (let index = 0; index < result.length; index++) {
    const data = result[index];
    const url = data.image;
    const key = `${nanoid(10)}.jpg`;

    await upload(url, key);

    data.postKey = key;

    await data.save();
  }
};
