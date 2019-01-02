const chai = require('chai');
const sinonChai = require('sinon-chai');
const prometheus = require('../../src/prometheus');

chai.use(sinonChai);
const { expect } = chai;

describe('prometheus configuration', () => {
  it('should exist', () => {
    expect(prometheus).to.be.ok;
  });
});
