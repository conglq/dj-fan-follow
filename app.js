const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json({
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  return res.json({
    name: 'API'
  });
});

const handleReq = func => (req, res, next) => func(req, res).catch(next)

const follow = require('./services/follow');
/**
 * @api {post} /dj/follow Follow an user
 * @apiName Follow User
 * @apiGroup DJ/FAN
 * @apiDescription Follow User
 * 
 * @apiParam {String} djUserId user id of DJ
 * @apiParam {String} actionUserId user id of listener
 *
 * @apiParamExample {json} Input
 *    {
 *      "djUserId": "djUserId"
 *      "actionUserId": "actionUserId"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "success": true
 *      "fanCount": 10
 *    }
 */
app.post('/dj/follow', handleReq(follow.create));

/**
 * @api {get} /dj/follow Get Fan List
 * @apiName Get Fan List
 * @apiGroup DJ/FAN
 * @apiDescription Get Fan List
 * 
 * @apiParam {String} userId user id of DJ
 * @apiParam {String} index index value from response. 0 for default
 * @apiParam {String} nexti nexti value from response, 0 for default
 * @apiParam {String} pagesize number of item in page
 *
 * @apiExample {curl} Example usage:
 * curl - i http://localhost:9999/dj/follow?userId=djuserid0&index=0&nexti=0&pagesize=10 
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "success": true
 *      "index": 1
 *      "nexti": 10
 *      "fanList": [
 *        {
 *          "id": "id",
 *          "name": "Mac"
 *        }
 *      ]
 *    }
 */
app.get('/dj/follow', handleReq(follow.get));

const block = require('./services/block');
/**
 * @api {post} /user/block Block an user
 * @apiName Block User
 * @apiGroup DJ/FAN
 * @apiDescription Block User
 * 
 * @apiParam {String} blockedUserId id of blocked user
 * @apiParam {String} actionUserId id of action user
 *
 * @apiParamExample {json} Input
 *    {
 *      "blockedUserId": "blockedUserId"
 *      "actionUserId": "actionUserId"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "success": true
 *    }
 */
app.post('/user/block', handleReq(block.create));

const profile = require('./services/profile');
/**
 * @api {post} /user/profile Get user profile
 * @apiName Get User Profile
 * @apiGroup DJ/FAN
 * @apiDescription Get User Profile
 * 
 * @apiParam {String} userId id of user profile
 * @apiParam {String} actionUserId id of action user
 *
 *  @apiExample {curl} Example usage:
 * curl - i http://localhost:9999/user/profile?userId=djuserid0&actionUserId=unblockUserId 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "profile": {
 *        "fanCount": 1
 *      }
 *    }
 */
app.get('/user/profile', handleReq(profile.get));

app.use('*', (req, res) => {
  return res.status(404).end();
});

app.use((err, req, res, next) => {
  console.error(err)
  return res.status(400).json({
    success: false,
    message: err.message
  })
})

module.exports = app;