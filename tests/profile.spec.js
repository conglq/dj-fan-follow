const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const helper = require('./helper');

describe('USER PROFILE', function () {
  this.timeout(1000000);

  const blockedUserId = Date.now();
  const actionUserId = helper.actionUserId;
  before(function (done) {
    request(app)
      .post('/user/block')
      .send({
        blockedUserId,
        actionUserId
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(() => {
        done();
      })
  });

  it('get user profile', function (done) {
    request(app)
      .get(`/user/profile?userId=${helper.djUserId}&actionUserId=${helper.unblockUserId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).has.property('success').eq(true);
        expect(response.body).has.property('profile').has.property('fanCount');
        done();
      })
  });
  
  it('get blocked user profile', function (done) {
    request(app)
      .get(`/user/profile?userId=${blockedUserId}&actionUserId=${actionUserId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).has.property('success').eq(false);
        expect(response.body).has.property('message').eq('BLOCKED_USER');
        done();
      })
  });
});