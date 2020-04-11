const connection = require('./connection');
const key = require('./key');

exports.get = (userId) => {
  return connection.hgetall(key.userProfile(userId));
}