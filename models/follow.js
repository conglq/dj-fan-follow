const R = require('ramda');
const connection = require('./connection');
const key = require('./key');
const config = require('../config');

exports.create = async ({
  djUserId,
  actionUserId
}) => {
  if (await isFollowed(djUserId, actionUserId)) {
    throw new Error('USER_FOLLOWED_BEFORE');
  }
  const [
    [],
    [, fanCount],
    [, indexstatistic],
  ] = await storageFollow(djUserId, actionUserId);
  updateIndexstatistic(indexstatistic, djUserId);
  return {
    fanCount
  }
}

function updateIndexstatistic(indexstatistic, djUserId) {
  indexstatistic > config.index.maxFanIndex && resetIndexstatistic(djUserId).catch(console.error);
}

function resetIndexstatistic(userId) {
  return R.pipe(
    conn => conn.multi(),
    resetFanListIncrStatistic(userId),
    incrFollowIndex(userId),
    conn => conn.exec()
  )(connection);
}

async function isFollowed(djUserId, actionUserId) {
  return Promise.resolve(false);
}

async function storageFollow(djUserId, actionUserId) {
  const index = await getFollowIndex(djUserId);
  return R.pipe(
    conn => conn.multi(),
    pushFollowList(djUserId, actionUserId, index),
    incrFollowCounter(djUserId),
    incrFanListIncrStatistic(djUserId),
    pushUserFollowingList(djUserId, actionUserId, index),
    conn => conn.exec()
  )(connection);
}

function pushUserFollowingList(djUserId, actionUserId, index) {
  return cmd => cmd.zadd(
    key.userFollowingList(actionUserId), followingScore(index), djUserId);
}

function followingScore(index) {
  return Date.now() + index;
}

async function getFollowIndex(djUserId) {
  const index = await connection.get(key.fanListIncr(djUserId));
  return index || 0;
}

function incrFollowIndex(userId) {
  return cmd => cmd.incr(key.fanListIncr(userId));
}

function incrFollowCounter(userId, incrNum = 1) {
  return cmd => cmd.hincrby(key.userProfile(userId), 'fanCount', incrNum);
}

function incrFanListIncrStatistic(userId) {
  return cmd => cmd.incr(key.fanListIncrStatistic(userId));
}

function resetFanListIncrStatistic(userId) {
  return cmd => cmd.set(key.fanListIncrStatistic(userId), 0);
}

function pushFollowList(djUserId, actionUserId, index) {
  return cmd => cmd.zadd(key.fanList(djUserId, index), Date.now(), actionUserId);
}

exports.unfollow = (djUserId, actionUserId) => {
  const getFollowIndex = R.compose(R.andThen(getFollowIndexFromScore), getFollowingScore);
  const removeFollowIfExisted = followIndex => {
    followIndex !== -1 && removeFollow(djUserId, actionUserId, followIndex);
  }
  return R.compose(
    R.andThen(removeFollowIfExisted),
    getFollowIndex
  )(djUserId, actionUserId);
}

function getFollowingScore(djUserId, actionUserId) {
  return connection.zscore(key.userFollowingList(actionUserId), djUserId);
}

function getFollowIndexFromScore(score) {
  return score ? score.toString().substring(13) : -1;
}

function removeFollow(djUserId, actionUserId, followIndex) {
  
  return R.pipe(
    conn => conn.multi(),
    removeFollowList(djUserId, actionUserId, followIndex),
    incrFollowCounter(djUserId, -1),
    removeUserFollowingList(djUserId, actionUserId),
    conn => conn.exec()
  )(connection);
}

function removeFollowList(djUserId, actionUserId, index) {
  return cmd => cmd.zrem(key.fanList(djUserId, index), Date.now(), actionUserId);
}

function removeUserFollowingList(djUserId, actionUserId) {
  return cmd => cmd.zrem(
    key.userFollowingList(actionUserId), djUserId);
}

exports.get = async (data) => {
  const {
    userIds,
    index,
    isNext,
    nexti
  } = await getFanUserIds(data);
  return {
    fanList: await getUsers(userIds),
    isNext,
    index,
    nexti
  }
}

function getUsers(userIds) {
  return Promise.all(userIds.map(userId => connection.hgetall(key.userProfile(userId))))
}

async function getFanUserIds({userId, index, nexti, pagesize}) {
  let userIds = [];
  let nextpagesize = pagesize;
  let moreUserIds = [];
  let isNext = await isExistedFanList(userId, index);
  while (isNext) {
    moreUserIds = await getFanListValueByPage(userId, index, nexti, nextpagesize);
    userIds = userIds.concat(moreUserIds)
    if (userIds.length < pagesize) {
      index++;
      nextpagesize = pagesize - userIds.length;
      nexti = 0;
      isNext = await isExistedFanList(userId, index);
    } else {
      break;
    }
  }
  return {
    userIds,
    isNext,
    index,
    nexti: nexti + nextpagesize
  }
}

async function isExistedFanList(userId, index) {
  const i = await connection.exists(key.fanList(userId, index));
  return i === 1;
}

function getFanListValueByPage(userId, index, nexti, pagesize) {
  return connection.zrange(key.fanList(userId, index), nexti, nexti + pagesize);
}