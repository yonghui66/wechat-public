const upload = require('./upload');
const Theaters = require('../../model/theaters');
// 生成唯一key
const nanoid = require('nanoid');

module.exports = async (key, Model) => {
  // postKey: { $or: [{postKey:''}, {postKey:null}, {postKey:{ $exists: false }}] }

  const result = await Model.find({
    [key]: { $in: ['', null] }
  });

  for (let index = 0; index < result.length; index++) {
    const data = result[index];

    let url = data.image;
    let lastKey = '.jpg';

    if (key === 'coverkey') {
      url = data.related_image;
    } else if (key === 'vedioKey') {
      url = data.vedio_url;
      lastKey = '.mp4';
    }

    lastKey = `${nanoid}${lastKey}`;

    await upload(url, lastKey);

    data[key] = lastKey;

    await data.save();
  }
};
