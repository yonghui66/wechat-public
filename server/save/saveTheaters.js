const Theaters = require('../../model/theaters');

module.exports = async list => {
  console.log(list);
  for (let index = 0; index < list.length; index++) {
    const data = list[index];

    const result = await Theaters.create({
      detail: data.detail,
      image: data.image,
      name: data.name,
      num: data.num
    });
  }
};
