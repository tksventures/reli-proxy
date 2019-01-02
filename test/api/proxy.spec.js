const chai = require('chai');
const chaiHttp = require('chai-http');
require('../../src/server');

const { expect } = chai;
chai.use(chaiHttp);
const remoteServer = 'http://127.0.0.1';
const port = process.env.PORT || 4000;

describe('/test', function module1() {
  this.timeout(10000);
  /*
  * Test the proxy
  */
  describe('proxy', () => {
    it('should forward ok', (done) => {
      setTimeout(() => {
        chai.request(`${remoteServer}:${port}`)
          .get('/test')
          .end((err, res) => {
            expect(res.status).to.eql(200);
            expect(res.text).to.include('Response from back-end!');
            done();
          });
      }, 50);
    });
  });
});
