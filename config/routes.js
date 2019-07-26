module.exports.routes = {
  'post /user/register': 'user.register',
  'all /auth/local': 'auth.local',
  'all /auth/:provider': 'auth.provider',
  'get /user/me': 'user.me',
  'all /user/logout': 'user.logout',
};
