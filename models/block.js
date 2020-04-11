const R = require('ramda');
const connection = require('./connection');
const key = require('./key');

exports.isBlocked = async (blockedUserId, actionUserId) => {
  const score = await connection.zscore(key.userBlockList(actionUserId), blockedUserId);
  return score !== null;
}

exports.addToBlockList = (blockedUserId, actionUserId) => {
  return R.pipe(
    conn => conn.multi(),
    pushToBlockList(blockedUserId, actionUserId),
    conn => conn.exec()
  )(connection);
}

function pushToBlockList(blockedUserId, actionUserId) {
  return cmd => cmd.zadd(key.userBlockList(actionUserId), Date.now(), blockedUserId);
}