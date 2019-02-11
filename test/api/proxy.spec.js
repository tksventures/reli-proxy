const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);
const remoteServer = 'http://127.0.0.1';
const port = process.env.PORT || 4000;
process.env.DELAY_IN_SECONDS = 1.6;
process.env.EXPIRE_IN_SECONDS = 3;
process.env.REQUEST_LIMIT = 1;
process.env.BACK_END_URL = '';
require('../../src/server');

describe('reli-proxy', function module1() {
  this.timeout(10000);
  /*
  * Test the throttling
  */
  describe('/Testing the throttling of requests', () => {
    it('it should rate limit second request', (done) => {
      setTimeout(() => {
        let requester = chai.request(`${remoteServer}:${port}`).keepOpen();
        Promise.all([
          requester.get('/test'),
          requester.get('/test'),
          requester.get('/test')
        ]).then(responses => {
          expect(responses[0].status).to.eql(200);
          expect(responses[0].text).to.include('Response from back-end!');
          // Rate limit exceeds but request is queued, since the window size is 3 seconds the request still fails
          expect(responses[1].status).to.eql(429);
          // Rate limit exceeds but request is queued, since the window size is 3 seconds and delay induced is 1.6*2 = 3.2 seconds the request is completed successfully
          expect(responses[2].status).to.eql(200); expect(responses[0].text).to.include('Response from back-end!');
          done();
        }).then(requester.close());
      }, 50);
    });
  });

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
      }, 3000);
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
