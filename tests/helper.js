exports.actionUserId = 'actionUserId'
exports.djUserId = 'djuserid0'
exports.unblockUserId = 'unblockUserId'

const conn = require('../models/connection');
const key = require('../models/key');
exports.createUserProfile = async (id = Date.now()) => {
  await conn.hmset(key.userProfile(id), {
    id,
    name: 'Mac W ' + id,
  });
  return id;
}