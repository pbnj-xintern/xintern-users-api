'use strict';
const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;
const userHelper = require('./helpers/user');
module.exports.createUser = async (event, context, callback) => {
  return await userHelper.createUser(JSON.parse(event.body));
};

module.exports.login = async (event, context, callback) => {
  return await userHelper.login(JSON.parse(event.body));
}




