/**
 * @Filename is-model-found.js
 * @Description 资源是否存在校验策略
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019/07/25
 */
module.exports = async function (req, res, proceed) {

  sails.log.debug(`${req.method} ${req.url} 【is-model-found】`);

  let modelId = req.param('id');
  let modelName;
  if(_.has(req.options,'action')) modelName = req.options.action.split('/')[0];
  else modelName = req.options.model || req.options.controller;

  if (!modelName || _.isEmpty(modelId)) return res.forbidden(new NullError());

  if (req.model
    && _.isEqual(req.model.id, modelId)) {
    return proceed();
  }

  let model = await sails.models[modelName].findOne(req.param('id'));
  if (model) {
    req.model = model;
    return proceed();
  }

  return res.forbidden(new NullError());

};
