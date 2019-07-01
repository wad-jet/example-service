var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = chai.expect;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('index', function() {
  describe('GET /', function() {
    it('Should redirect to /auth/google', function(done) {
      const request = chai.request(app);
      request
        .get('/')
        .then(function(res) {
          expect(res).to.redirectTo(/.*\/auth\/google/);
          expect(res).to.redirectTo(/https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?.*/);
          res.should.have.status(200);          
          done();
        });
    })
  });

  describe('GET /logout', function() {
    it('Should redirect to /', function(done) {
      const request = chai.request(app);
      request
        .get('/logout')
        .then(function(res) {
          expect(res).to.redirectTo(/.*\//);
          expect(res).to.redirectTo(/.*\/auth\/google/);
          expect(res).to.redirectTo(/https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?.*/);
          res.should.have.status(200);
          done();
        });
    })
  });
});