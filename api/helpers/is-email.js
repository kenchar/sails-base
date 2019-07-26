module.exports = {


  friendlyName: 'Is email',


  description: '输入值是否为邮箱地址',

  inputs: {
    value: {
      type: 'string',
      description: '邮箱地址',
      required: true
    }
  },


  exits: {},

  fn: async function (inputs, exits) {

    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,14})$/g;

    if (!new RegExp(pattern).test(inputs.value)) return exits.success(false);

    return exits.success(true);
  }


};

