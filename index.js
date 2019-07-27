const requireAll = require('require-all');
const path = require('path');
const eventsToWaitFor = ['hook:orm:loaded'];
const passport = require('passport');
module.exports = sails => {

  return {

    initialize: () => {

      sails.after(eventsToWaitFor, () => {

        let strategies = sails.config.custom.passport;

        _.each(strategies, (obj, key) => {
          let options = {
            passReqToCallback: true,
            callbackURL: '/auth/'+key+'/callback'
          };
          let Strategy = obj.strategy;

          _.extend(options, obj.options);

          passport.use(new Strategy(options,obj.callback));
        });
      });
    },

    routes: {
      before: {}
    },

    configure() {
      this.loadConfig();
      //this.loadHelpers();
      this.loadModels();
      this.loadActions();
      this.loadPolicies();
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
          return key.toLowerCase()
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

    },

    //注入到sails环境内
    mergeEntities(namespace, entities) {

      function transformEntities(entities) {
        return _.chain(entities)
          .mapValues((entity, key) => {
            return _.defaults(entity, {
              globalId: key,
              identity: key.toLowerCase()
            })
          })
          .mapKeys((entity, key) => {
            return key.toLowerCase();
          })
          .value()
      }

      sails[namespace] = _.merge(sails[namespace] || {}, transformEntities(entities));
    },

    //注册action到sails
    registerAction (actions,parentActionPath){
      let that = this;
      _.each(actions, (action,key) => {
        if(_.has(action,'friendlyName')) {
          sails.registerAction(action,path.join(parentActionPath||'',key));
          return;
        }
        that.registerAction(_.mapValues(action),path.join(parentActionPath||'',key));
      });
    }

  }

};

