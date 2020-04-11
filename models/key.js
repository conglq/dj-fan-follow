
exports.fanList = (djId, index) => `fan:${djId}:list:${index}`;
exports.fanListIncr = (djId) => `fan:${djId}:index`;
exports.fanListIncrStatistic = (djId) => `fan:${djId}:indexstatistic`;
exports.userProfile = (userId) => `user:${userId}:profile`;
exports.userFollowingList = (userId) => `user:${userId}:following`;
exports.userBlockList = (userId) => `user:${userId}:blocked`;
