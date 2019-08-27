/**
 * @Filename is-logged-in.js
 * @Description session校验策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019-07-25
 */
module.exports = async function (req, res, proceed) {

  if(req.session
    && req.session.authenticated
    && _.has(req.session,'passport')) return proceed();

  if(_.isEmpty(req.headers.cookie)) return res.forbidden(new SessionError());

  let sessionId = sails.session.parseSessionIdFromCookie(req.headers.cookie);

  if(_.isEmpty(sessionId)) return res.forbidden(new SessionError());

  sails.session.get(sessionId,function(err,session){
    req.session.passport = session.passport;
    req.session.authenticated = true;
    return proceed();
  });

};
