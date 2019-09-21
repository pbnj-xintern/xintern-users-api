'use strict';
const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const userHelper = require('./helpers/user');
const checkRequestBody = require('@pbnj-xintern/xintern-commons/util/request_checker');
module.exports.createUser = async (event, context, callback) => {
	return await 
		userHelper.createUser(typeof(event.body) == "object" ? event.body : JSON.parse(event.body));
};

module.exports.login = async (event, context, callback) => {
	return await 
		userHelper.login(typeof(event.body) == "object" ? event.body : JSON.parse(event.body));
}

module.exports.updateUser = async (event, context, callback) => {
	const e = typeof(event.body) == "object" ? event.body : JSON.parse(event.body);
	if(checkRequestBody(e, User) && e.password == null && e.username == null){
		return await
			userHelper.updateUser(event.pathParameters.uid, e);
	}
	
	return status.createErrorResponse(401, "Bad update request");

}






