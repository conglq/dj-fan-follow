const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');


describe('HTTP', function () {
  it('init /', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).has.property('name').eq('API')
        done();
      })
  });
});