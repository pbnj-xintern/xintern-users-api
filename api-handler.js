'use strict';
const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;
const userCreator = require('./helpers/user');
module.exports.createUser = async (event, context, callback) => {
  let result = await userCreator.createUser(event);
  console.log(result)
};




