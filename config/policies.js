module.exports.policies = {

  'auth/*': 'passport',
  'user/me': 'is-logged-in',
  'user/logout': 'is-logged-in'

};
