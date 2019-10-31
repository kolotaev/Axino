const chai = require('chai').should();

const { AggregateRoot } = require('../lib/aggregate');


describe('AggregateRoot', () => {
  describe('#toString()', function() {
    describe('should return aggregate class name and ID string representation', () => {
      it('for base class', () => {
        const ar = new AggregateRoot(123);
        `${ar}`.should.equal('AggregateRoot: 123');
      });
      it('for custom class', () => {
        const clazz = class OrderAggregateRoot extends AggregateRoot {}
        const orderAR = new clazz('asdf');
        `${orderAR}`.should.equal('OrderAggregateRoot: asdf');
      });
    });
  });
});
