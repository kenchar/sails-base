module.exports.custom = {

  bcrypt: {
    rounds: 8,
  },

  passport: {
    wechat: {
      callback: async function (req, accessToken, refreshToken, profile, expriredIn, done) {
        let passport;
        try {
          passport = await Passport.findOne({
            provider: this.name,
            identifier: profile.openid
          });
          if (passport) {
            passport.accessToken = accessToken;
            await Passport.updateOne(passport.id, passport);
          } else {
            let user = await User.create({
              username: profile.openid
            }).fetch();

            if (user)
              passport = await Passport.create({
                provider: this.name,
                protocol: this.protocol,
                identifier: profile.openid,
                accessToken: accessToken,
                user: user.id
              });
          }
          done(null, passport);
        } catch (e) {
          done(e.message);
        }
      }
    }
  }

};
