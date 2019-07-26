module.exports.http = {

  middleware: {

  },

  /**
   * 自定义业务异常
   */
  businessErrors: {
    NullError: {
      code: 'E_VALIDATION_NULL',
      message: 'The model is not exist.'
    },
    PermissionError: {
      code: 'E_VALIDATION_PERMISSION',
      message: 'You are not permitted to perform this action.'
    },
    SessionError: {
      code: 'E_VALIDATION_SESSION',
      message: 'You are not logined.'
    }
  }

};
