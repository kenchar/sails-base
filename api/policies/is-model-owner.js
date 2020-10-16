/**
 * @Filename is-model-owner.js
 * @Description 资源归属校验策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/07/25
 */
module.exports = async function (req, res, proceed) {

  if(!req.session
    || !req.session.authenticated
    || !_.has(req.session,'passport')){
    return res.forbidden(new SessionError());
  }

  let modelId = req.param('id');
  let modelName;

  if(_.has(req.options,'action')) modelName = req.options.action.split('/')[0];
  else modelName = req.options.model || req.options.controller;

  if (!modelName || _.isEmpty(modelId)) return res.forbidden(new NullError());

  let passport = req.session.passport;

  let userId = _.has(passport.user,'id') ? passport.user.id : passport.user;
  let model = req.model;

  if (!model
    || !_.isEqual(model.id, modelId)) {
    model = await sails.models[modelName].findOne(modelId);
  }

  if (model) {
    req.model = model;
    let ownerId = _.has(model.createdBy, 'id') ? model.createdBy.id : model.createdBy;
    if (_.isEqual(ownerId, userId)) return proceed();
    return res.forbidden(new PermissionError());
  }

  return res.forbidden(new NullError());

};
