module.exports = {


  friendlyName: 'Hash password',


  description: '密码加密(+salt)',


  inputs: {
    password: {
      type: 'string',
      description: '加密前密码',
      required: true
    }
  },


  exits: {
    hashFailed: {
      description: 'hash加密失败.'
    }
  },


  fn: async function (inputs, exits) {

    const bcrypt = require('bcryptjs');
    const config = sails.config.custom.bcrypt;
    const salt = config.salt || config.rounds;
    return exits.success(bcrypt.hashSync(inputs.password, salt));
  }


};

