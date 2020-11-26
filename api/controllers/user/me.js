module.exports = {


  friendlyName: 'Me',


  description: '获取当前登录用户信息.',


  inputs: {},


  exits: {},


  fn: async function (inputs, exits) {

    let passport = await Passport.findOne(this.req.session.passport.id || this.req.session.passport._id)
      .populate('user');

    return exits.success(passport);

  }


};
