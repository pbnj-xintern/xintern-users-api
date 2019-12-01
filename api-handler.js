'use strict';
const status = require('@pbnj-xintern/xintern-commons/util/status')
const UserHelper = require('./helpers/user');

module.exports.createUser = async (event, context, callback) => {
  let body = typeof (event.body) === 'string' ? JSON.parse(event.body) : event.body
  return await UserHelper.createUser(body);
};

module.exports.login = async (event, context, callback) => {
  let body = typeof (event.body) === 'string' ? JSON.parse(event.body) : event.body
  return await UserHelper.login(body);
}

module.exports.patchAdminUser = async event => {

  let body = typeof (event.body) === 'string' ?
    JSON.parse(event.body) :
    event.body

  let pathParameters = typeof (event.pathParameters) === 'string' ?
    JSON.parse(event.pathParameters) :
    event.pathParameters

  if (!body)
    return status.createErrorResponse(403, 'Not authorized to request this patch')

  if (!pathParameters)
    return status.createErrorResponse(400, 'No ID supplied')

  return await UserHelper.patchToAdmin(pathParameters.userId, body.adminId)

}

module.exports.getUserByUsername = async event => {

  let pathParameters = typeof (event.pathParameters) === 'string' ?
    JSON.parse(event.pathParameters) :
    event.pathParameters


  if (!pathParameters)
    return status.createErrorResponse(400, 'Username was not supplied')
  let userObj = await UserHelper.getUserByUsername(pathParameters.username)
  if (!userObj)
    return status.createErrorResponse(500, 'Could not find user')
  return status.createSuccessResponse(200, userObj)

}