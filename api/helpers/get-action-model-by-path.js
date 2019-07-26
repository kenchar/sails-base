module.exports = {


  friendlyName: 'Get action model by path',


  description: '根据访问路径获取action定义类',


  inputs: {
    reqPath: {
      type: 'string',
      description: 'action访问路径',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Action model by path',
    },

  },


  fn: async function (inputs, exits) {

    let actionPath = inputs.reqPath.substring(1);
    if (sails.getActions()[actionPath]) {
      return exits.success(sails.getActions()[actionPath].toJSON());
    }

  }


};

