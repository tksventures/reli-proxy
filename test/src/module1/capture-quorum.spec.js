const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const module1 = require('../../../src/module1');

chai.use(sinonChai);
const { expect } = chai;


describe('module1', () => {
  describe('.action', () => {
    it('should exist', () => {
      expect(module1.action).to.be.ok;
    });

    it('should call return "we got it"', () => {
      expect(module1.action()).to.eql('we got it');
    });
  });
});
