/**
 * @Filename passport.js
 * @Description passport初始化策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019-07-26
 */
const passport = require('passport');
module.exports = async function (req, res, proceed) {

  // Initialize Passport
  passport.initialize()(req, res, function () {
    // Use the built-in sessions
    passport.session()(req, res, function () {
      proceed();
    });
  });

};
