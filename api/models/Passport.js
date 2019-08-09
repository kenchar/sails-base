/**
 * Passport.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    protocol: {
      type: 'string',
      description: '授权协议类型: oauth，oauth2，openapi等',
    },
    provider: {
      type: 'string',
      description: '第三方服务授权平台: local，wechat，sina_weibo等',
      required: true
    },
    accessToken: {
      type: 'string',
      description: '授权凭证：第三方授权登录——token',
    },
    identifier: {
      type: 'string',
      description: '身份唯一标识：系统内账号为用户名或者邮箱地址，第三方授权账号为外部系统用户标识',
      required: true
    },
    password: {
      type: 'string',
      description: 'local用户加密密码'
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    user: {
      model: 'User',
      required: true
    }
  },

  customToJSON: function(){
    return _.omit(this,['password']);
  },

  beforeCreate: async function (recordToCreate, proceed) {
    if (_.isEqual('local', recordToCreate.provider)) {
      recordToCreate.password
        = await sails.helpers.hashPwd(recordToCreate.password);
    }
    return proceed();
  },

  beforeUpdate: async function (valuesToSet, proceed) {
    if (_.isEqual('local', valuesToSet.provider)) {
      valuesToSet.password
        = await sails.helpers.hashPwd(recordToCreate.password);
    }
    return proceed();
  },

  violationMessages: {
    provider: {
      required: '请输入第三方授权平台名称.'
    },
    identifier: {
      required: '身份ID不能为空.'
    },
    user: {
      required: '关联用户不能为空.'
    }
  }

};

