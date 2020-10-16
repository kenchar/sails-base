/**
 * @Filename set-create-or-update-user.js
 * @Description 创建或者更新model时注入创建或者更新的用户信息
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2020-09-07
 */
module.exports = async function (req, res, proceed) {

  if (_.isEqual(req.method, 'POST')
    || _.isEqual(req.method, 'PUT')
    || _.isEqual(req.method, 'DELETE')) {

    let attributeName = _.isEqual(req.method, 'POST') ? 'createdBy' : 'updatedBy';

    if (req.session
      && req.session.authenticated
      && _.has(req.session, 'passport')) {
      req.body[attributeName] = req.session.passport.user;
      return proceed();
    }

    if (!_.isEmpty(req.headers.cookie)) {
      let sessionId = sails.session.parseSessionIdFromCookie(req.headers.cookie);

      if (_.isEmpty(sessionId)) return proceed();

      sails.session.get(sessionId, function (err, session) {
        req.body[attributeName] = session.passport.user;
        return proceed();
      });
    }

  }

  return proceed();
};
