const chai = require('chai');
const chaiHttp = require('chai-http');
require('../../src/server');

const { expect } = chai;
chai.use(chaiHttp);
const remoteServer = 'http://127.0.0.1';
const port = process.env.PORT || 3000;

describe('/module1', function module1() {
  this.timeout(10000);
  /*
  * Test the /GET route
  */
  describe('/GET', () => {
    it('should return ok', (done) => {
      setTimeout(() => {
        chai.request(`${remoteServer}:${port}`)
          .get('/raml/module1')
          .end((err, res) => {
            expect(res.status).to.eql(200);
            // expect(res.body).to.be.a('string');
            expect(res.text).to.be.eql('we got it');
            done();
          });
      }, 5000);
    });
  });
});
