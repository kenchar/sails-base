/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    username: {
      type: 'string'
    },
    email: {
      type: 'string',
      isEmail: true,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    passports: {
      collection: 'Passport',
      via: 'user'
    }

  },

  customToJSON: function(){
    return _.omit(this,['passports']);
  },

  beforeCreate: async function (recordToCreate, next) {
    let userCount = 0;
    if (!_.isEmpty(recordToCreate.username)) {
      //判断是否用户名唯一
      userCount = await User.count({
        username: recordToCreate.username
      });
      if (userCount > 0) {
        return next(new Error(User.violationMessages.username.unique));
      }
    }
    if (!_.isEmpty(recordToCreate.email)) {
      //判断是否邮箱唯一
      userCount = await User.count({
        email: recordToCreate.email
      });
      if (userCount > 0) {
        return next(new Error(User.violationMessages.email.unique));
      }
    }
    return next();
  },

  beforeUpdate: function (valueToSet, next) {

    return next();
  },

  violationMessages: {
    username: {
      unique: '用户名重复,请更换用户名.',
      required: '用户名不能为空.'
    },
    email: {
      unique: '邮箱已被占用,请更换邮箱地址.',
      required: '邮箱地址不能为空.',
      isEmail: '邮箱格式不正确.'
    }
  }

};

