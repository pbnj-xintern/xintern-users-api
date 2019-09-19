const User = require('@pbnj-xintern/xintern-commons/models/User');
const status = require('@pbnj-xintern/xintern-commons/util/status')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var db = require('@pbnj-xintern/xintern-commons/util/db');
const dbUrl = process.env.MONGO_URL;

module.exports.createUser = async e => {
  const event = JSON.parse(e.body);
  console.log("Searching for existing user...");
  let user = await db(dbUrl, () =>
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
        name: {
          first: event.name.first,
          last: event.name.last
        },
        sex: event.sex,
        program: event.program,
        age: event.age,
        isShowInfo: event.isShowInfo,
        role: event.role, //XINT or ADMIN
      });
      try {
        let result = await db(dbUrl, () => user.save());
        console.log(`User created: ${user.username}`)
        return status.createSuccessResponse(201, {
          user: result.username
        });
      } catch (err) {
        return status.createErrorResponse(500, err.message)
      }
    } catch (err) {
      return status.createErrorResponse(500, "Unable to generate hash")
    }
  }

}

module.exports.patchToAdmin = async (newAdminId, adminId) => {

  let isAdmin = await db(
    dbUrl,
    () => User.find({ _id: adminId }).select('role').then(doc => {
      if (!doc)
        return false
      return doc[0].role === 'ADMIN'
    })
  )

  if (!isAdmin)
    return status.createErrorResponse(403, "Not authorized to create account")

  return db(
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