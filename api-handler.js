'use strict';
const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;

module.exports.createUser = async (event, context, callback) => {
  return db(dbUrl, () => 
    User.find({
      username: event.body.username
    })
  ).then(user => {
    if (user.length > 0) {
      return status.createErrorResponse(401, "User exists");
    } else {
      bcrypt.hash(event.body.password, 10, (err, hash) => {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          username: event.body.username,
          password: hash,
          name: {
              first: event.body.name.first,
              last: event.body.name.last
          },
          sex: event.body.sex,
          program: event.body.program,
          age: event.body.age,
          isShowInfo: event.body.isShowInfo,
          role: event.body.role, //XINT or ADMIN
        });
        return db(dbUrl, () => user.save().catch(err => 
          status.createErrorResponse(500, err)
        ))
        .then(res => {
          console.log(res, 'RESSSSS')
          if (res){
            return status.createSuccessResponse(201, "User created")
          }
        })
      });
    }
  })
};




