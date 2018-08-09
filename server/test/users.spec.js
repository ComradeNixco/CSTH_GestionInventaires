let supertest = require('supertest');
let expect = require('chai').expect;
let app = require('../app');
let HttpCodes = require('http-status-codes');
let atob = require('atob');

let request = supertest(app);

const BASE_URL = '/users';

describe('Users API tests', () => {
  describe('POST /users/login', () => {
    it('should respond with HTTP 400 (BAD REQUEST) if request body is malformed', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return a JWT upon a successful login', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({
          'username': 'test',
          'passwd': 'Password01$'
        })
        .expect(HttpCodes.OK, (err, res) => {
          expect(res.body).to.have.property('token').that.is.a('string');
          const payload = verifyForJWT(res.body.token);
          expect(payload.username).to.equal('test');
          done(err);
        })
      ;
    });

    it('should respond with HTTP 401 (UNAUTHORIZED) if trying to connect with bad credentials', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({
          'username': 'test',
          'passwd': 'ABadPassword01$'
        })
        .expect(HttpCodes.UNAUTHORIZED, done)
      ;
    });
  }); // END POST /users/login

  describe('POST /users/register', () => {
    it('should respond with HTTP 400 (BAD REQUEST) if request body is malformed', done => {
      request
        .post(`${BASE_URL}/register`)
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return HTTP 200 (OK) to confirm account creation', done => {
      request
        .post(`${BASE_URL}/register`)
        .send({
          'username': 'aNewTestUser',
          'passwd': 'Password01$'
        })
        .expect(HttpCodes.OK, done)
      ;
    });
  });

  describe('Authenticated routes (non-admin)', () => {
    let auth = {};
    before(login('test', 'Password01$', auth));

    describe('GET /users/:username', () => {
      it('should refuse an unauthenticated request', done => {
        request
          .get(`${BASE_URL}/test`)
          .expect(HttpCodes.UNAUTHORIZED, done)
        ;
      });

      it('should return a valid user object with HTTP 200 ', done => {
        request
          .get(`${BASE_URL}/test`)
          .set('Authorization', `bearer ${auth.token}`)
          .expect(HttpCodes.OK)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('username').that.is.a('string').that.equals('test');
            expect(res.body).to.have.property('isActive').that.is.a('boolean').that.equals(true, 'The test user should be activated');
            expect(res.body).to.have.property('isAdmin').that.is.a('boolean').that.equals(false, 'test user represents a \'normal\' user for the sake of testing');
            // The user object returned by this route will most probably get other fields (like a theme id or name or what not)
          })
        ;
      });
    });
  });

  describe('Authenticated routes (Admin)', () => {
    describe('GET /users', () => {
      let authAdmin = {};
      let authUser = {};
      before(login('test-admin', 'Password01$', authAdmin));
      before(login('test', 'Password01$', authUser));

      it('should refuse an unauthicated request', done => {
        request
          .get(`${BASE_URL}/`)
          .expect(HttpCodes.UNAUTHORIZED, done)
        ;
      });

      it('should refuse an authenticated request from a non-admin user', done => {
        request
          .get(`${BASE_URL}/`)
          .set('Authorization', `bearer ${authAdmin.token}`)
          .expect(HttpCodes.FORBIDDEN, done)
        ;
      });

      it('should accept an admin-authenticated request and return an array of users', done => {
        request
          .get(`${BASE_URL}/`)
          .set('Authorization', `bearer ${authAdmin.token}`)
          .expect(HttpCodes.OK)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body).to.be.an('array').that.is.not.empty('With the test users, the users array shouldn\'t be empty');
            // NOTE: perhaps add more test to assert that the array content are actually user objects
          })
        ;
      });
    });
  });

  function verifyForJWT(body) {
    expect(body).to.be.a('string');
    expect(body).to.match(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/, 'The token string should be well-formatted'); // official jwt regex

    let b64 = body.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    let payload = JSON.parse(atob(b64));
    expect(payload).to.have.property('username').that.is.a('string');
    expect(payload).to.have.property('exp').that.is.a('number').greaterThan((new Date()).getTime());
    expect(payload).to.have.property('iat').that.is.a('number');

    expect(payload.exp).to.be.greaterThan(new Date());

    return payload;
  }

  function login(username, passwd, auth) {
    return done => {
      request
        .post(`${BASE_URL}/login`)
        .send({
          'username': username,
          'passwd': passwd
        })
        .expect(HttpCodes.OK)
        .end(onResponse)
      ;

      let onResponse = (err, res) => {
        auth.token = res.body.token;
        done();
      };
    };
  }
});