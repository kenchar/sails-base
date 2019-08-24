module.exports = {


  friendlyName: 'Provider',


  description: '第三方授权登录入口',


  inputs: {
    code: {
      type: 'string',
      description: '第三方平台用户登录code.',
      required: true
    }
  },


  exits: {
    providerNotFoundError: {
      description: 'provider not found.',
      outputDescription: 'provider参数为空，请检查url地址是否正确.',
      responseType: 'serverError'
    },
    providerConfigNotFoundError: {
      description: 'provider\'s config not found. ',
      outputDescription: '未找到对应的provider的配置参数',
      responseType: 'serverError'
    },
    callbackFnNotFoundError: {
      description: 'provider\'s callback function not found.',
      outputDescription: '未配置回调函数',
      responseType: 'serverError'
    }

  },


  fn: async function (inputs, exits) {

    let that = this;
    let provider = that.req.param('provider');

    if (_.isEmpty(provider)) throw {
      providerNotFoundError: new Error('provider参数为空，请检查url地址是否正确.')
    };

    let strategies = sails.config.custom.passport;

    if (!_.has(strategies, provider)) throw {
      providerConfigNotFoundError: new Error('未找到' + provider + '对应的配置参数.')
    };

    if (!strategies[provider].callback
      || !_.isFunction(strategies[provider].callback)) throw {
      callbackFnNotFoundError: new Error('未找到' + provider + '对应的回调方法.')
    };

    return require('passport').authenticate(provider, function (err, passport, info) {
      if (err) return exits.error(_.isError(err) ? err : new Error(err));
      that.req.session.passport = passport;
      that.req.session.authenticated = true;
      return exits.success({
        token: passport.accessToken
      });
    })(this.req, this.res, this.req.next);

  }


};
