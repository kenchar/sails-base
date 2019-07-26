/**
 * @Filename is-model-owner.js
 * @Description 资源归属校验策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/07/25
 */
module.exports = async function (req, res, proceed) {

  let modelId = req.param('id');
  let modelName = req.options.model || req.options.controller;
  let userId = req.session.user.id;
  let model = req.model;
  let ownerId;

  if (_.isEmpty(modelId)) return res.forbidden(new NullError());

  if (!model
    || !_.isEqual(model.id, modelId)) {
    model = await sails.models[modelName].findOne(modelId);
  }

  if (model) {
    req.model = model;
    ownerId = _.has(model.user, 'id') ? model.user.id : model.user;
    if (_.isEqual(ownerId, userId)) return proceed();
    return res.forbidden(new PermissionError());
  }

  return res.forbidden(new NullError());

};
