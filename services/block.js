const block = require('../models/block');
const follow = require('../models/follow');
const R = require('ramda');
const Promise = require('bluebird');

async function create(req, res) {
  const {
    blockedUserId,
    actionUserId
  } = req.body;
  if (await block.isBlocked(blockedUserId, actionUserId)) {
    throw new Error("BLOCKED_USER");
  }

  const disableFollow = () => Promise.all([
    follow.unfollow(blockedUserId, actionUserId),
    follow.unfollow(actionUserId, blockedUserId)
  ]);
  await R.pipe(
    block.addToBlockList,
    R.andThen(disableFollow)
  )(blockedUserId, actionUserId)

  return res.json({
    success: true,
  })  
}

module.exports = {
  create
}