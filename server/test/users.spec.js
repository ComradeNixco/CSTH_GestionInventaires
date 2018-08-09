let supertest = require('supertest');
let expect = require('chai').expect;
let app = require('../app');
let HttpCodes = require('http-status-codes');
let atob = require('atob');

let request = supertest(app);

describe('Users API tests', () => {
  describe('POST /users/login', () => {
    it('should respond with HTTP 400 (BAD REQUEST) if request body is malformed', done => {
      request
        .post('/users/login')
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return a JWT upon a successful login', done => {
      request
        .post('/users/login')
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
        .post('/users/login')
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
        .post('/users/register')
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return HTTP 200 (OK) to confirm account creation', done => {
      request
        .post('/users/register')
        .send({
          'username': 'aNewTestUser',
          'passwd': 'Password01$'
        })
        .expect(HttpCodes.OK, done)
      ;
    });
  });

  describe('Authenticated routes', () => {
    let token = '';
    before(login());

    describe('GET /users/:username', () => {
      it('should refuse an unauthenticated request', done => {
        request
          .get('/users/test')
          .expect(HttpCodes.UNAUTHORIZED, done)
        ;
      });

      it('should return a valid user object with HTTP 200 ', done => {
        request
          .get('/users/test')
          .set('Authorization', `bearer ${token}`)
          .expect(HttpCodes.OK)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }

            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('username').that.is.a('string').that.equals('test');
            expect(res.body).to.have.property('isActive').that.is.a('boolean').that.equals(true, 'The test user should be activated');
            expect(res.body).to.have.property('isAdmin').that.is.a('boolean').that.equals(false, 'test user represents a \'normal\' user for the sake of testing');
            // The user object returned by this route will most probably get other fields (like a theme id or name or what not)
          })
        ;
      });
    });

    describe('GET /users', () => {

    });

    function login() {
      return done => {
        request
          .post('/users/login')
          .send({
            'username': 'test',
            'passwd': 'Password01$'
          })
          .expect(HttpCodes.OK)
          .end(onResponse)
        ;

        let onResponse = (err, res) => {
          token = res.body.token;
          done();
        };
      };
    }

    function loginAsAdmin() {
      return done => {
        request
          .post('/users/login')
          .send({
            'username': 'test-admin',
            'passwd': 'Password01$'
          })
          .expect(HttpCodes.OK)
          .end(onResponse)
        ;

        let onResponse = (err, res) => {
          if (err) {
            done(err);
            return;
          }

          token = res.body.token;
          done();
        };
      };
    }
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
});