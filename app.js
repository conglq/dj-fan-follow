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
app.post('/dj/follow', handleReq(follow.create));
app.get('/dj/follow', handleReq(follow.get));

const block = require('./services/block');
app.post('/user/block', handleReq(block.create));

const profile = require('./services/profile');
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