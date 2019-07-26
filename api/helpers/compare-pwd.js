module.exports = {


  friendlyName: 'Compare pwd',


  description: 'hash密码比对.',


  inputs: {
    password: {
      type: 'string',
      description: '未加密的密码.',
      required: true
    },
    hash: {
      type: 'string',
      description: '加密后的密码.',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    const bcrypt = require('bcryptjs');
    let isMatch = bcrypt.compareSync(inputs.password, inputs.hash);
    return exits.success(isMatch);
  }


};

