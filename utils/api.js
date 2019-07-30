const url = 'https://api.weixin.qq.com/cgi-bin/';

module.exports = {
  accessToken: `${url}token?grant_type=client_credential`,
  ticket: `${url}ticket/getticket?type=jsapi`,
  menu: {
    createMenu: `${url}menu/create`,
    deleteMenu: `${url}menu/delete`
  },
  qiniuUrl:'http://pvfy4w816.bkt.clouddn.com/'
};
