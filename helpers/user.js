const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;

module.exports.createUser = async event => {
  console.log("Searching for existing user...");
  let user = await db.exec(dbUrl, () =>
    User.find({
      username: event.username
    })
  )

  if (user.length > 0) {
    console.log(`found exisiting user: ${user.username}`);
    return status.createErrorResponse(401, "User exists");
  }
  else {
    console.log("creating user...")
    try {
      const hash = await bcrypt.hash(event.password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: event.username,
        password: hash,
        email: event.email,
        institution: event.institution,
        firstName: event.firstName,
        lastName: event.lastName,
        sex: event.sex,
        program: event.program,
        age: event.age,
        isShowInfo: event.isShowInfo,
        role: "XINT",
      });
      try {
        let result = await db.exec(dbUrl, () => user.save());
        console.log(`User created: ${user.username}`)
        return status.createSuccessResponse(201, {
          user: result.username
        });
      } catch (err) {
        return status.createErrorResponse(500, err.message)
      }
    } catch (err) {
      console.log(err)
      return status.createErrorResponse(500, "Unable to generate hash")
    }
  }



}

module.exports.login = async data => {
  let user = await db.exec(dbUrl, () => User.find({ username: data.username }));
  if (user.length !== 1)
    return status.createErrorResponse(401, 'Authentication Failed')
  else {
    try {
      let bycryptResult = await bcrypt.compare(data.password, user[0].password);
      if (!bycryptResult)
        return status.createErrorResponse(401, 'Authentication Failed');
      const token = jwt.sign({
        username: user[0].username,
        userId: user[0]._id
      },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1d"
        }
      );
      console.log(`Generated token: ${token}`);
      return status.createSuccessResponse(200, {
        message: 'Login Successful',
        token: token,
        uid: user[0]._id
      })

    } catch (err) {
      return status.createErrorResponse(401, err.message);
    }
  }
}


module.exports.patchToAdmin = async (newAdminId, adminId) => {

  let isAdmin = await db.exec(
    dbUrl,
    () => User.find({ _id: adminId }).select('role').then(doc => {
      if (!doc)
        return false
      return doc[0].role === 'ADMIN'
    })
  )

  if (!isAdmin)
    return status.createErrorResponse(403, "Not authorized to create account")

  return db.exec(
    dbUrl,
    () => User.findOneAndUpdate({ _id: newAdminId }, { role: "ADMIN" }).then(user => {
      if (!user)
        return status.createErrorResponse(500, "Could not update user to admin")
      console.log('User ' + user._id + ' patched')
      return status.createSuccessResponse(200, 'Promoted user to ADMIN')
    }).catch(e => {
      console.log('Error while patching user', e)
      status.createErrorResponse(500, "Could not update user to admin")
    })
  );
}

module.exports.getUserByUsername = async username =>
  db.exec(dbUrl, () =>
    User.find({ username: username })
      .then(users => {
        if (users.length > 1) throw new Error('Found too many users')

        let obtainedUser = users[0]

        if (!obtainedUser.isShowInfo) {
          return {
            username: obtainedUser.username,
            isShowInfo: false
          }
        }

        return {
          username: obtainedUser.username,
          email: obtainedUser.email,
          institution: obtainedUser.institution,
          program: obtainedUser.program,
          createdAt: obtainedUser.createdAt,
          isShowInfo: true
        }
      })
      .catch(e => { console.error('error finding username', e); return false })
  )