const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;

module.exports.createUser = async event => {
    console.log("Searching for existing user...");

    let user = await db(dbUrl, () =>
    User.find({
      username: event.body.username
    })
  )

  if (user.length > 0) {
    console.log("found exisiting user:" + user.username);
    return status.createErrorResponse(401, "User exists");
  }
  else {
    console.log("creating user...")
    const hash = await bcrypt.hash(event.body.password, 10);
    console.log(hash);
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
    try{
      let result = await db(dbUrl, () => user.save());
      return status.createSuccessResponse(201, {
      user: result.username
      });
    }catch(err){
      return status.createErrorResponse(401, err.message)
    }
  
  }
    
}