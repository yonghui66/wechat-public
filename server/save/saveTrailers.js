const Trailers = require('../../model/trailers');

module.exports = async list => {
  for (let index = 0; index < list.length; index++) {
    const data = list[index];

    await Trailers.create({
      detail: data.detail,
      image: data.image,
      name: data.name,
      num: data.num,
      doubanid: data.doubanid,
      image: data.image,
      title: data.title,
      pd: data.pd,
      starring: data.starring,
      property: data.property,
      related: data.related,
      related_image: data.related_image,
      vedio_url: data.vedio_url
    });
  }
};
