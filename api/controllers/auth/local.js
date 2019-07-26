module.exports = {


  friendlyName: 'Local',


  description: '本地账号授权登录.',


  inputs: {
    identifier: {
      type: 'string',
      description: '登录账号，可用户名可邮箱登录',
      required: true
    },
    password: {
      type: 'string',
      description: '登录密码',
      required: true
    }
  },

  exits: {
    userNotFoundError: {
      description: 'user not found..',
      outputDescription: '账号密码错误.',
      responseType: 'serverError'
    },
    passportNotFoundError: {
      description: 'passport not found.',
      outputDescription: '账号密码错误.',
      responseType: 'serverError'
    },
    passportNotMatchError: {
      description: 'passport not match.',
      outputDescription: '账号密码错误.',
      responseType: 'serverError'
    }
  },

  violationMessages: {
    identifier: {
      required: '用户名不能为空.'
    },
    password: {
      unique: '密码不能为空.'
    }
  },


  fn: async function (inputs, exits) {

    //判断登录账号是否为邮箱
    let isEmail = await sails.helpers.isEmail(inputs.identifier);
    let where = {};
    if (isEmail) where.email = inputs.identifier;
    else where.username = inputs.identifier;

    let user = await User.findOne(where);
    if (!user) throw {
      userNotFoundError: new Error('账号密码错误.')
    };

    let passport = await Passport.findOne({
      identifier: inputs.identifier,
      user: user.id
    });

    if (!passport) throw {
      passportNotFoundError: new Error('账号密码错误.')
    };

    //密码加密匹配是否一致
    let matchPwd = await sails.helpers.comparePwd(inputs.password, passport.password);
    if (!matchPwd) throw {
      passportNotMatchError: new Error('账号密码错误.')
    };

    this.req.session.passport = passport;
    this.req.session.authenticated = true;

    return exits.success();
  }


};
