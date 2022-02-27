const admin = require("firebase-admin");
const database = admin.database();
module.exports = async (user, string) => {

  let transitionsDir = `user/${user.id}/economy/transitions`
  let transitions = await database.ref(transitionsDir).once('value')
  transitions = transitions.val()

  if (!transitions) await database.ref(transitionsDir).set([string])
  else {
    transitions.push(string)
    await database.ref(transitionsDir).set(transitions)
  }
  return null
  
}