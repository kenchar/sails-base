var sails = require('sails');

// Before running any tests...
before(function (done) {

  this.timeout(10000);

  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    log: {
      level: 'info'
    },
    globals: {
      _: require('@sailshq/lodash'),
      async: false,
      models: true,
      sails: true,
    },
    session: {
      secret: 'a3485661eb03569b92a62871a3efd978'
    },
    hooks: {
      grunt: false,
      //views: false,
    },
    models: {
      migrate: 'drop'
    },
    custom: {
      testLocalUser: [{
        username: 'test',
        password: 'test123456'
      },{
        email: 'test@seekow.com',
        password: 'test123456'
      }]
    },
    port: 1448
  }, function (err) {
    if (err) {
      return done(err);
    }

    //here you can load fixtures, etc.
    //(for example, you might want to create some records in the database)
    _.forEach(sails.config.custom.testLocalUser, function(localUser){
      let where = {};
      if(!_.isEmpty(localUser.username)) where.username = localUser.username;
      if(!_.isEmpty(localUser.email)) where.email = localUser.email;
      User.findOne(where).exec(function (err, user) {
        if (err) return done(err);
        if (user) {
          sails.log('Found existing user: %s', user.username || user.email);
        } else {
          User.create(localUser).fetch()
            .then(function (user) {
              sails.log.info('create a new user: %s', user.username || user.email);
              return Passport.create({
                provider: 'local',
                identifier: localUser.username || localUser.email,
                password: localUser.password,
                user: user.id
              }).fetch();
            })
            .then(function (passport) {
              sails.log.info('create a user\'s passport success.');
            })
            .catch(function (err) {
              return done(err);
            });
        }
      });
    });

    // 保证数据创建完成
    setTimeout(function(){
      return done();
    },500);

  });
});

// After all tests have finished...
after(function (done) {

  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)

  if (!sails) done();
  else sails.lower(done);

});
