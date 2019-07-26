module.exports = {


  friendlyName: 'Register',


  description: '注册本地账号.',


  inputs: {
    identifier: {
      type: 'string',
      description: '注册账号',
      required: true
    },
    password: {
      type: 'string',
      description: '密码',
      required: true,
      minLength: 8
    }
  },


  exits: {},

  violationMessages: {
    identifier: {
      required: '注册账号不能为空.'
    },
    password: {
      unique: '密码不能为空.',
      minLength: '密码长度不得少于8个字符.'
    }
  },


  fn: async function (inputs, exits) {

    let isEmail = await sails.helpers.isEmail(inputs.identifier);

    let userInfo = {};

    if (isEmail) {
      //邮箱形式注册
      userInfo.email = inputs.identifier
    } else {
      //用户名形式注册
      userInfo.username = inputs.identifier
    }

    let user = await User.create(userInfo).fetch();

    if (user) await Passport.create({
      provider: 'local',
      identifier: inputs.identifier,
      password: inputs.password,
      user: user.id
    });

    return exits.success(user);
  }


};
