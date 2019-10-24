const chai = require('chai').should();

const { AggregateRoot } = require('../../../lib/aggregate');

describe('AggregateRoot', () => {
  describe('#toString()', function() {
    describe('should return aggregate class name and ID string representation', () => {
      it('for base class', () => {
        let ar = new AggregateRoot(123);
        `${ar}`.should.equal('AggregateRoot: 123');
      });
      it('for custom class', () => {
        let orderARClass = class OrderAggregateRoot extends AggregateRoot {}
        let orderAR = new orderARClass('asdf');
        `${orderAR}`.should.equal('OrderAggregateRoot: asdf');
      });
    });
  });
});
