let supertest = require('supertest');
let expect = require('chai').expect;
let app = require('../app');

let request = supertest(app);

describe('Sample API test', () => {
  describe('GET /users', () => {
    it('returns with a OK message', done => {
      request.get('/users')
        .expect(200)
        .end((err, res) => {
          done(err);
        });
    });
  });
});