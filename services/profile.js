const profile = require('../models/profile');
const block = require('../models/block');
const R = require('ramda');

exports.get = async (req, res) => {
  const {
    userId,
    actionUserId
  } = req.query;
  
  const user = await R.pipe(
    checkBlockedProfile,
    R.andThen(profile.get)
  )(userId, actionUserId);

  return res.json({
    success: true,
    profile: formatProfile(user || {
      fanCount: 0
    })
  })
}

function isBlockedEachOther(userId, actionUserId) {
  return R.pipe(
    () => Promise.all([block.isBlocked(userId, actionUserId), block.isBlocked(actionUserId, userId)]),
    R.andThen(([isBlocked1, isBlocked2]) => isBlocked1 || isBlocked2)
  )()
}

function checkBlockedProfile(userId, actionUserId) {
  return R.compose(
    R.andThen(isBlocked => {
      if (isBlocked) {
        throw new Error('BLOCKED_USER')
      }
      return userId
    }),
    isBlockedEachOther
  )(userId, actionUserId)
}

const formatProfile = R.pick(['fanCount']);