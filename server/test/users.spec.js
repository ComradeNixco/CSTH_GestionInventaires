let supertest = require('supertest');
let expect = require('chai').expect;
let app = require('../app');
let HttpCodes = require('http-status-codes');
let atob = require('atob');

let request = supertest(app);

const BASE_URL = '/users';

describe('Users API tests', function() {
  describe('POST /users/login', function() {
    it('should respond with HTTP 400 (BAD REQUEST) if request body is malformed', function(done) {
      request
        .post(`${BASE_URL}/login`)
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return a JWT upon a successful login', function(done) {
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

    it('should respond with HTTP 401 (UNAUTHORIZED) if trying to connect with bad credentials', function(done) {
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

  describe('POST /users/register', function() {
    it('should respond with HTTP 400 (BAD REQUEST) if request body is malformed', function(done) {
      request
        .post(`${BASE_URL}/register`)
        .send({}) // Some invalid JSON object
        .expect(HttpCodes.BAD_REQUEST, done)
      ;
    });

    it('should return HTTP 200 (OK) to confirm account creation', function(done) {
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

  describe('Authenticated routes (non-admin)', function() {
    let auth = {};
    before(login('test', 'Password01$', auth));

    describe('GET /users/:username', function() {
      it('should refuse the request of an unauthenticated user', unAuthenticatedTest(`${BASE_URL}/test`));

      it('should return HTTP 404 (NOT FOUND) if username don\'t exist', function(done) {
        request
          .get(`${BASE_URL}/Waldo`)
          .expect(HttpCodes.NOT_FOUND, done)
        ;
      });

      it('should return a valid user object with HTTP 200 ', function(done) {
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

  describe('Authenticated routes (Admin)', function() {
    let authAdmin = {};
    let authUser = {};
    before(login('test-admin', 'Password01$', authAdmin));
    before(login('test', 'Password01$', authUser));

    describe('GET /users', function() {
      it('should refuse the request of an unauthenticated user', unAuthenticatedTest(BASE_URL));
      it('should refuse an authenticated request from a non-admin user', nonAdminTest(BASE_URL));

      /*it('should refuse an authenticated request from a non-admin user', function(done) {
        request
          .get(`${BASE_URL}/`)
          .set('Authorization', `bearer ${authAdmin.token}`)
          .expect(HttpCodes.FORBIDDEN, done)
        ;
      });*/

      it('should accept an admin-authenticated request and return an array of users', function(done) {
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

    describe('POST /users/:username/isActive', function () {
      it('should refuse the request of an unauthenticated user', unAuthenticatedTest(`${BASE_URL}/test/isActive`));
      it('should refuse to proceed if asking user isn\'t admin', nonAdminTest(`${BASE_URL}/test/isActive`));

      // In this test it is assumed that test-admin is the only admin user hence the last one
      it('should refuse to deactivate the last admin user', function(done) {
        getUserInfo('test-admin', 'isActive', function(err, val) {
          if (err) return done(err);

          const startingState = val;

          request
            .post(`${BASE_URL}/test-admin/isActive`)
            .set('Authorization', `bearer ${authAdmin.token}`)
            .expect(HttpCodes.CONFLICT) // if a better error code could be use this should be replaced with that "better" one, also if it happens the payload assertion should be change to reflect that modification
            .end(function(er, res) {
              if (er) return done(er);

              expect(res.body).to.have.property('state').that.is.a('boolean');
              expect(res.body).to.have.property('conflictReason').that.is.a('string').which.equals('This user is the last admin, it cannot be deactivated');

              const newState = res.body.state;
              expect(newState).to.equal(startingState);
            })
          ;
        });
      });

      it('should accept and toggle the activeness state of the user', function(done) {
        getUserInfo('test', 'isActive', function(err, val) {
          if (err) return done(err);

          const startingState = val;

          request
            .post(`${BASE_URL}/test/isActive`)
            .set('Authorization', `bearer ${authAdmin.token}`)
            .expect(HttpCodes.OK)
            .end(function(er, res) {
              if (er) return done(er);

              expect(res.body).to.have.property('newState').that.is.a('boolean');
              const newState = res.body.newState;

              expect(newState).to.not.equal(startingState);
            })
          ;
        });
      });
    });

    describe('POST /users/:username/isAdmin', function() {
      it('should refuse the request of an unauthenticated user', unAuthenticatedTest(`${BASE_URL}/test/isAdmin`));
      it('should refuse to proceed if asking user isn\'t an admin', nonAdminTest(`${BASE_URL}/test/isAdmin`));

      it('should refuse to "un-admin" the last admin user', function(done) {
        getUserInfo('test-admin', 'isAdmin', function(err, val) {
          if (err) return done(err);

          const startingState = val;

          request
            .post(`${BASE_URL}/test-admin/isAdmin`)
            .set('Authorization', `bearer ${authAdmin.token}`)
            .expect(HttpCodes.CONFLICT) // if a better error code could be use this should be replaced with that "better" one, also if it happens the payload assertion should be change to reflect that modification
            .end(function(er, res) {
              if (er) return done(er);

              expect(res.body).to.have.property('state').that.is.a('boolean');
              expect(res.body).to.have.property('conflictReason').that.is.a('string').which.equals('This user is the last admin, it cannot be stripped of it\' admin rights');

              const newState = res.body.state;
              expect(newState).to.equal(startingState);
            })
          ;
        });
      });

      it('should accept and toggle the admin state of the user if the client has admin rights', function(done) {
        getUserInfo('test', 'isAdmin', function(err, val) {
          if (err) return done(err);

          const startingState = val;

          request
            .post(`${BASE_URL}/test/isAdmin`)
            .set('Authorization', `bearer ${authAdmin.token}`)
            .expect(HttpCodes.OK)
            .end(function(e, res) {
              if (e) return done(e);

              expect(res.body).to.have.property('newState').that.is.a('boolean');
              const newState = res.body.newState;

              expect(newState).to.not.equal(startingState);
            })
          ;
        });
      });
    });

    /**
     * Prepare a test callback to test if a non-admin user gets HTTP 403 (Forbidden) when trying to do admin actions
     *
     * @param {*} route The route to test
     * @returns {Mocha.Func} The prepared test callback
     */
    function nonAdminTest(route) {
      return function(done) {
        request
          .get(route)
          .set('Authorization', `bearer ${authUser.token}`)
          .expect(HttpCodes.FORBIDDEN, done)
        ;
      };
    }
  });

  /**
   * Gets the User's asked info from the Express App
   *
   * @param {string} username
   * @param {string} infoname name of the wanted property in the User object
   * @param {(err, val)=>void} cb A callback to call to handle the value of the asked information
   */
  function getUserInfo(username, infoName, cb) {
    request
      .get(`${BASE_URL}/${username}`)
      .expect(HttpCodes.OK)
      .end(function(err, res){
        cb(err, res.body[infoName]);
      })
    ;
  }

  /**
   * Validate a JWT token and returns it's payload upon validation of it
   *
   * @param {*} body The object to validate
   * @returns
   */
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

  /**
   * Login a user to obtain a valid JWT token representing it, returning a function doing it as a callback/thunk
   *
   * @param {*} username
   * @param {*} passwd
   * @param {*} auth object that will be added a token property containing the token for the asked login attempt (if successful)
   * @returns {Mocha.Func} The callback doing the login attempt for the asked credentials
   */
  function login(username, passwd, auth) {
    return done => {
      request
        .post(`${BASE_URL}/login`)
        .send({
          'username': username,
          'passwd': passwd
        })
        .expect(HttpCodes.OK)
        .end(function(err, res) {
          auth.token = res.body.token;
          done();
        })
      ;
    };
  }

  /**
     * Prepare a test callback to test if an unauthenticated user gets HTTP 401 (UNAUTHORIZED) when trying to do protected actions or accessing protected ressources
     *
     * @param {*} route The route to test
     * @returns {Mocha.Func} The prepared test callback
     */
  function unAuthenticatedTest(route) {
    return function(done) {
      request
        .get(route)
        .expect(HttpCodes.UNAUTHORIZED, done)
      ;
    };
  }
});