process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = chai.expect;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('users', function() {

  function checkIncResponse(res, incPropertyName) {
    res.should.have.status(200);
    res.should.be.an('object');
    expect(res.body[incPropertyName]).to.be.not.undefined;
    expect(res.body[incPropertyName]).to.be.a('number');
    const result = res.body[incPropertyName];
    return result;
  }
  
  function incrementValueTest(incPropertyName, done) {
    const agent = chai.request.agent(app);
      agent.get(`/users/${incPropertyName}Increment`).then(function(res) {
        const firstValue = checkIncResponse(res, incPropertyName);
        return agent.get(`/users/${incPropertyName}Increment`).then(function(res) {
          const increasedValue = checkIncResponse(res, incPropertyName);
          expect(increasedValue - firstValue).to.be.eq(1);
          return agent.get(`/users/${incPropertyName}Decrement`).then(function(res) {
            const decreasedValue1 = checkIncResponse(res, incPropertyName);
            expect(decreasedValue1).to.be.eq(firstValue);
            return agent.get(`/users/${incPropertyName}Decrement`).then(function(res) {
              const decreasedValue2 = checkIncResponse(res, incPropertyName);
              expect(decreasedValue1 - decreasedValue2).to.be.eq(1);
              agent.close();
              done();
            });
          });
        });
      });
  }

	describe('increment / decrement values', function() {
		it('Should increment level +2 and decrement -2', function(done) {
			incrementValueTest('level', done);
		});
		it('Should increment rating +2 and decrement -2', function(done) {
			incrementValueTest('rating', done);
		});
  });
  
  describe('Find nearest user', function() {
    it('Should found nearest user by level 0 and rating 0', function(done) {
      const request = chai.request(app);
      const rating = 0, level = 0;
      request
        .get(`/users/findNearestUser/${rating}/${level}`)
        .then(function(res) {
          const user = res.body;
          res.should.have.status(200);

          expect(user).to.be.an('object');

          expect(user.id).to.not.undefined; expect(user.id).to.be.above(0);
          expect(user.email).to.not.undefined; expect(user.email).to.be.a('string');
          expect(user.level).to.not.undefined; expect(user.level).to.be.least(0);
          expect(user.rating).to.not.undefined; expect(user.rating).to.be.least(0);

          expect(user.profile).to.be.an('object');

          expect(user.profile.id).to.not.undefined; expect(user.profile.id).to.be.a('number'); expect(user.profile.id).to.be.above(0);
          expect(user.profile.userId).to.not.undefined; expect(user.profile.userId).to.be.a('number'); expect(user.profile.userId).to.be.above(0);
          expect(user.profile.providerName).to.not.undefined; expect(user.profile.providerName).to.be.a('string'); 
          expect(user.profile.providerName).to.be.deep.eq('GOOGLE');
          expect(user.profile.providerUserId).to.not.undefined; expect(user.profile.providerUserId).to.be.a('string');
          expect(user.profile.userName).to.not.undefined; expect(user.profile.userName).to.be.a('string');

          done();
        });
    })
  })
});
