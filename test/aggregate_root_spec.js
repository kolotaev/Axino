require('chai').should();

const { AggregateRoot } = require('../lib/aggregate');


describe('AggregateRoot', () => {
  describe('#toString()', () => {
    describe('should return aggregate class name and ID string representation', () => {
      it('for base class', () => {
        const ar = new AggregateRoot(123);
        `${ar}`.should.equal('AggregateRoot: 123');
      });
      it('for custom class', () => {
        const Clazz = class OrderAggregateRoot extends AggregateRoot {};
        const orderAR = new Clazz('asdf');
        `${orderAR}`.should.equal('OrderAggregateRoot: asdf');
      });
    });
  });
});
