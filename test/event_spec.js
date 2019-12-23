require('chai').should();

const { Event } = require('../lib/event');


describe('Event', () => {
  describe('#clone()', () => {
    describe('should return event\'s deep copy', () => {
      it('when called without props', () => {
        const ev = new Event({ aggregate_id: 'asdf', sequence_number: 109 });
        const ev2 = ev.clone();
        ev2.should.have.own.property('aggregateID').that.equal('asdf');
        ev2.should.have.own.property('sequenceNumber').that.equal(109);
        // ev2.aggregate_id.should.equal('asdf');
        // ev2.sequence_number.should.equal(109);
      });
      it('for custom class', () => {
        // const Clazz = class OrderAggregateRoot extends AggregateRoot {};
        // const orderAR = new Clazz('asdf');
        // `${orderAR}`.should.equal('OrderAggregateRoot: asdf');
      });
    });
  });
});
