require('chai').should();

const { Event } = require('../lib/event');


describe('Event', () => {
  it('should have aggregateID and sequenceNumber', () => {
    const ev = new Event({
      aggregate_id: 'ttyy',
      sequence_number: 10000000000000000000000000000000000000,
      bar: 'me',
    });
    ev.should.have.property('aggregateID').that.equals('ttyy');
    ev.should.have.property('sequenceNumber').that.equals(10000000000000000000000000000000000000);
  });
  describe('#payload', () => {
    it('should return original event attributes', () => {
      const ev = new Event({
        aggregate_id: 'zxc',
        sequence_number: 1,
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
      ev.payload.should.eql({
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
    });
  });
  describe('#clone()', () => {
    describe('should return event\'s deep copy', () => {
      it('when called without props', () => {
        const ev = new Event({ aggregate_id: 'asdf', sequence_number: 109, foo: [1, 5, { a: 'b' }] });
        const ev2 = ev.clone();
        ev2.should.have.own.property('aggregateID').that.equal('asdf');
        ev2.should.have.own.property('sequenceNumber').that.equal(109);
        ev2.payload.should.eql(0);
        ev2.aggregateID.should.equal('asdf');
        ev2.sequenceNumber.should.equal(109);
      });
      it('when called without props', () => {
        // const Clazz = class OrderAggregateRoot extends AggregateRoot {};
        // const orderAR = new Clazz('asdf');
        // `${orderAR}`.should.equal('OrderAggregateRoot: asdf');
      });
    });
  });
});
