module.exports = {


  friendlyName: 'Logout',


  description: '用户退出.',


  inputs: {},


  exits: {},


  fn: async function (inputs, exits) {

    delete this.req.session.passport;
    this.req.session.authenticated = false;

    return exits.success();

  }


};
