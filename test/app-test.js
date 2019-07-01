var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Index', function() {
  describe('GET /', function() {
    it('Response should have status 200', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
  });
});