const requireAll = require('require-all');
const path = require('path');
const eventsToWaitFor = ['hook:orm:loaded', 'hook:pubsub:loaded'];
const passport = require('passport');
const loadHelpers = require('./lib/load-helpers');
const chalk = require('chalk');
module.exports = sails => {

  return {

    initialize: () => {

      sails.after(eventsToWaitFor, () => {
        let strategies = sails.config.custom.passport;

        _.each(strategies, (obj, key) => {
          let options = {
            passReqToCallback: true,
            callbackURL: '/auth/' + key + '/callback'
          };
          let Strategy = obj.strategy;

          _.extend(options, obj.options);

          passport.use(new Strategy(options, obj.callback));
        });
      });
    },

    loadModules: function (cb) {
      let responsePath = path.resolve(__dirname, './api/responses');
      sails.modules.loadResponses(function loadedRuntimeErrorModules(err, responseDefs) {
        if (err) {
          return cb(err);
        }

        _.extend(sails.hooks.responses.middleware, {
          serverError: require(path.resolve(responsePath, 'serverError')),
          forbidden: require(path.resolve(responsePath, 'forbidden')),
        });
        _.defaults(responseDefs, sails.hooks.responses.middleware);

        sails.hooks.responses.middleware = responseDefs;
        sails.log.debug(`loaded responses from ${responsePath}`);
        return cb();
      });
    },

    routes: {
      before: {
        'all /*': function (req, res, next) {
          //打印请求信息
          let userId = '...';
          if (sails.config.http.params.debug) {
            sails.log.debug(chalk.grey(Array(56).join('>')));
            sails.log.debug(chalk.grey(`:: ${new Date()}`));
            sails.log.debug(`${chalk.grey(req.method)} ${req.url}`);
            let params = _.omit(req.allParams(), ['0']);
            if (req.session && req.session.passport) {
              _.extend(params, {
                userId: req.session.passport.user
              });
              userId = req.session.passport.user;
            }
            sails.log.debug(chalk.grey('Request Datas From ') + userId +  '\n' + JSON.stringify(params));
          }
          //打印返回信
          if (sails.config.http.params.debug) {
            let sendFn = res.send;
            res.send = function (body) {
              sendFn.apply(res, Array.prototype.slice.call(arguments));
              if (_.isObject(body)) {
                if (!_.isNull(body) && !Buffer.isBuffer(body)) {
                  return;
                }
              }
              sails.log.debug(chalk.grey('Response status') + ' ' + res.statusCode);
              sails.log.debug(chalk.grey('Response Datas To ') + userId + '\n' + body);
              sails.log.debug(chalk.grey(`:: ${new Date()}`));
              sails.log.debug(chalk.grey(Array(56).join('<')));
            };
          }
          return next();
        }
      },
    },

    configure() {
      this.loadConfig();
      this.loadModels();
      this.loadActions();
      this.loadPolicies();
      this.loadHelpers();
    },

    loadConfig() {
      let configPath = path.resolve(__dirname, './config');
      try {
        let configModules = requireAll({
          dirname: configPath,
          filter: /(.+)\.js$/
        });
        let sailsConfig = _.reduce(_.values(configModules), _.merge);
        _.defaultsDeep(sails.config, sailsConfig);
        sails.log.debug(`loaded config from ${configPath}`);
      } catch (e) {
        sails.log.debug(`no configuration found in ${configPath}. Skipping...`);
      }
    },

    loadModels() {
      let modelPath = path.resolve(__dirname, './api/models');
      try {
        let models = requireAll({
          dirname: modelPath,
          filter: /(.+)\.js$/
        });
        this.mergeEntities('models', models);
        sails.log.debug(`loaded Models from ${modelPath}`);
      } catch (e) {
        sails.log.warn(`no Models found in ${modelPath}. Skipping...`);
      }
    },

    loadPolicies() {
      let policyPath = path.resolve(__dirname, './api/policies');
      try {
        let policies = requireAll({
          dirname: policyPath,
          filter: /(.+)\.js$/
        });
        _.extend(sails.hooks.policies.middleware, _.mapKeys(policies, (policy, key) => {
          return key.toLowerCase();
        }));
        sails.log.debug(`loaded Policies from ${policyPath}`);
      } catch (e) {
        sails.log.warn(`no Policies found in ${policyPath}. Skipping...`);
      }

    },

    loadActions() {
      let actionPath = path.resolve(__dirname, './api/controllers');
      try {
        let actions = requireAll({
          dirname: actionPath,
          filter: /(.+)\.js$/
        });
        this.registerAction(actions);
        sails.log.debug(`loaded Actions from ${actionPath}`);
      } catch (e) {
        sails.log.warn(`no Actions found in ${actionPath}. Skipping...`);
      }
    },

    loadHelpers() {
      let helpersPath = path.resolve(__dirname, './api/helpers');
      loadHelpers(sails, helpersPath, function (err) {
        sails.log.debug(`loaded helpers from ${helpersPath}.`);
      });
    },

    //注入到sails环境内
    mergeEntities(namespace, entities) {

      function transformEntities(entities) {
        return _.chain(entities)
          .mapValues((entity, key) => {
            return _.defaults(entity, {
              globalId: key,
              identity: key.toLowerCase()
            });
          })
          .mapKeys((entity, key) => {
            return key.toLowerCase();
          })
          .value();
      }

      sails[namespace] = _.merge(sails[namespace] || {}, transformEntities(entities));
    },

    //注册action到sails
    registerAction(actions, parentActionPath) {
      let that = this;
      _.each(actions, (action, key) => {
        if (_.has(action, 'friendlyName')) {
          sails.registerAction(action, path.join(parentActionPath || '', key));
          return;
        }
        that.registerAction(_.mapValues(action), path.join(parentActionPath || '', key));
      });
    }

  };

};
