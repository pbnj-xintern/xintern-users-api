'use strict';
const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const TEST_KEY = process.env.TEST_KEY


module.exports.createUser = async (event, context, callback) => {
db(
  'mongodb+srv://pbnj:test@cluster0-iuvsd.mongodb.net/test?retryWrites=true&w=majority', 
  () => {
    User.find({
      username: event.body.username
    }).then(user => {
      if (user.length > 0){
        console.log("here")
        return status.createErrorResponse(409, "Username exists");
      } else{
        const hash = bcrypt.hash(event.body.password, 10, (err, hash) => {
          if (err) {
              console.log(err)
          } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: event.body.username,
                password: hash,
                email: event.body.email,
                institution: event.body.institution,
                name: {
                    first: event.body.name.first,
                    last: event.body.name.last
                },
                sex:  event.body.sex ,
                program: event.body.program,
                age: event.body.age,
                isShowInfo: event.body.isShowInfo,
                role: event.body.role, //XINT or ADMIN
                profileLinks: event.body.profileLinks
              });
              db('mongodb+srv://pbnj:test@cluster0-iuvsd.mongodb.net/test?retryWrites=true&w=majority', 
              () => {
                user.save()
                  .then(result => {
                      console.log(result)
                      return status.sendSuccessResponse(201, "success")
                  })
                  .catch(err => {
                    console.log("here")
                      console.log(err)
                  })})
          }
      });
      }
      })
  })

};




