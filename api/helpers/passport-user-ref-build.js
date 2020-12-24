module.exports = {


  friendlyName: 'Passport user ref build',


  description: '第三方授权登录成功后token记录',


  inputs: {
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
    },
    unionId: {
      type: 'string',
      description: '统一平台ID,多系统统一主体的用户标识',
    }
  },


  exits: {
    paramsError: {
      description: 'params error.',
      outputDescription: '必填参数值缺失',
      responseType: 'serverError'
    }
  },


  fn: async function (inputs,exits) {
    let passport;
    let where = {};
    if(_.isEmpty(inputs.identifier) && !_.isEmpty(inputs.unionId)){
      where = {
        unionId: inputs.unionId
      };
    }else if(!_.isEmpty(inputs.identifier)){
      where = {
        provider: inputs.provider,
        identifier: inputs.identifier
      };
    }else{
      throw {
        paramsError: new Error('参数值有误!')
      };
    }
    passport = await Passport.findOne(where);
    if (passport) {
      passport.accessToken = inputs.accessToken;
      passport.protocol = inputs.protocol;
      await Passport.updateOne(passport.id, passport);
    } else {
      let user = await User.create({
        username: inputs.identifier
      }).fetch();

      if (user)
        passport = await Passport.create({
          provider: inputs.provider,
          protocol: inputs.protocol,
          identifier: inputs.identifier,
          unionId: inputs.unionId,
          accessToken: inputs.accessToken,
          user: user.id
        }).fetch();
    }
    return exits.success(_.omit(passport,['password']));
  }


};

