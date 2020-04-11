const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const helper = require('./helper');

describe('FOLLOW', function () {
  this.timeout(1000000);
  const djUserId = helper.djUserId;
  const actionUserId = Date.now();

  before(function (done) {
    Promise.all([
      helper.createUserProfile(actionUserId),
      helper.createUserProfile(djUserId)
    ]).then(() => {
      done();
    })
    
  });

  it('follow DJ', function (done) {
    request(app)
      .post('/dj/follow')
      .send({
        djUserId,
        actionUserId
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).has.property('success').eq(true);
        expect(response.body).has.property('fanCount');
        done();
      })
  });

  it('get fan list', function (done) {
    request(app)
      .get(`/dj/follow?userId=${djUserId}&index=0&nexti=1&pagesize=10`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).has.property('success').eq(true);
        expect(response.body).has.property('index');
        expect(response.body).has.property('fanList');
        expect(response.body).has.property('nexti');
        done();
      });
  });
});