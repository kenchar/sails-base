/**
 * serverError.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.serverError();
 *     // -or-
 *     return res.serverError(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'serverError'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function serverError(optionalData) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Define the status code to send in the response.
  var statusCodeToSet = 500;

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.serverError()');
    return res.sendStatus(statusCodeToSet);
  }
  // Else if the provided data is an Error instance, if it has
  // a toJSON() function, then always run it and use it as the
  // response body to send.  Otherwise, send down its `.stack`,
  // except in production use res.sendStatus().
  else if (_.isError(optionalData)) {
    sails.log.info('Custom response `res.serverError()` called with an Error:', optionalData);
    if(_.isFunction(optionalData.toJSON)) {
      sails.log.info(optionalData.toJSON());
    }
    return res.status(statusCodeToSet).send({
      message: optionalData.message
    });
  }
  // Set status code and send response data.
  else {
    return res.status(statusCodeToSet).send({
      message: optionalData
    });
  }

};
