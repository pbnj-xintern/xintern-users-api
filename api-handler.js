'use strict';
const status = require('@pbnj-xintern/xintern-commons/util/status')
const UserHelper = require('./helpers/user');

module.exports.createUser = async (event, context, callback) => {
  return await userHelper.createUser(JSON.parse(event.body));
};

module.exports.login = async (event, context, callback) => {
  return await userHelper.login(JSON.parse(event.body));
}

module.exports.patchAdminUser = async event => {

  console.log('hittinghere')

  let body = typeof (event.body) === 'string' ?
    JSON.parse(event.body) :
    event.body

  let pathParameters = typeof (event.pathParameters) === 'string' ?
    JSON.parse(event.pathParameters) :
    event.pathParameters

  console.log('pathp', pathParameters)
  console.log('b', body)

  if (!body)
    return status.createErrorResponse(403, 'Not authorized to request this patch')

  if (!pathParameters)
    return status.createErrorResponse(400, 'No ID supplied')

  return await UserHelper.patchToAdmin(pathParameters.userId, body.adminId)

}