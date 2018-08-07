let supertest = require('supertest');
//let expect = require('chai').expect;
let app = require('../app');

let request = supertest(app);

describe('Sample API test', () => {
  describe('GET /', () => {
    it('returns with a valid json hello world', done => {
      request.get('/')
        .expect(200, {'hello': 'world!'}, done);
    });
  });
});