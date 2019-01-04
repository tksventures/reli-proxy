const chai = require('chai');
const chaiHttp = require('chai-http');
require('../../src/server');

const { expect } = chai;
chai.use(chaiHttp);
const remoteServer = 'http://127.0.0.1';
const port = process.env.PORT || 4000;

describe('reli-proxy', function module1() {
  this.timeout(10000);
  /*
  * Test the proxy
  */
  describe('/test', () => {
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

  describe('/metrics', () => {
    it('should provide metrics for monitoring', (done) => {
      setTimeout(() => {
        chai.request(`${remoteServer}:${port}`)
          .get('/metrics')
          .end((err, res) => {
            expect(res.status).to.eql(200);
            expect(res.text).to.include('Number of requests made');
            expect(res.text).to.include('Paths taken in the app');
            expect(res.text).to.include('Response time in millis');
            expect(res.text).to.include('Duration of HTTP requests in ms');
            done();
          });
      }, 50);
    });
  });
});
