const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const helper = require('./helper');

describe('BLOCK', function () {
  this.timeout(1000000);

  const blockedUserId = Date.now();
  const actionUserId = helper.djUserId;
  it('block an user', function (done) {
    request(app)
      .post('/user/block')
      .send({
        blockedUserId,
        actionUserId
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).has.property('success').eq(true);
        done();
      })
  });
});