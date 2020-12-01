/**
 * @Filename is-logged-in.js
 * @Description session校验策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019-07-25
 */
module.exports = async function (req, res, proceed) {

  if (req.session
    && req.session.authenticated
    && _.has(req.session, 'passport')) {
    return proceed();
  }

  if (!_.isEmpty(req.headers.cookie)) {
    //从cookie里获取登录会话信息
    let sessionId = sails.session.parseSessionIdFromCookie(req.headers.cookie);

    if (!_.isEmpty(sessionId)) {
      sails.session.get(sessionId, function (err, session) {
        if (_.isNull(session)
          || _.isUndefined(session)
          || _.isUndefined(session.passport)) {
          return res.forbidden(new SessionError());
        }
        req.session.passport = session.passport;
        req.session.authenticated = true;
        return proceed();
      });
    } else {
      return res.forbidden(new SessionError());
    }
  } else if (!_.isEmpty(req.headers.token) || !_.isEmpty(req.param('token'))) {
    //从token里获取会话信息
    let passport = await Passport.findOne({
      accessToken: req.headers.token || req.param('token')
    });
    if (passport) {
      req.session.passport = passport;
      req.session.authenticated = true;
      return proceed();
    } else {
      return res.forbidden(new SessionError());
    }
  } else {
    return res.forbidden(new SessionError());
  }

};
