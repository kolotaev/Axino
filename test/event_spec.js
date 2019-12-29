require('chai').should();

const { Event, SnapshotEvent } = require('../lib/event');


describe('Event', () => {
  describe('.fullSchema()', () => {
    it('should return full inherited event schema', () => {
      class My extends SnapshotEvent {
        static schema() {
          return {
            foo: { type: 'String' },
          };
        }
      }
      My.fullSchema().should.eql({
        aggregateID: {
          present: true,
          type: 'String',
        },
        data: {
          type: 'String',
        },
        dateCreated: {
          present: true,
          type: 'Date',
        },
        foo: {
          type: 'String',
        },
        sequenceNumber: {
          present: true,
          type: 'Integer',
        },
      });
    });
  });

  describe('.schema()', () => {
    it('should return own event schema', () => {
      class My extends SnapshotEvent {
        static schema() {
          return {
            foo: { type: 'String' },
          };
        }
      }
      My.schema().should.eql({
        foo: {
          type: 'String',
        },
      });
    });

    it('should override any parent\'s fields in case ov overlapping fields', () => {
      class My extends Event {
        static schema() {
          return {
            aggregateID: { type: 'Integer' },
          };
        }
      }
      My.fullSchema().should.eql({
        aggregateID: {
          type: 'Integer',
        },
        dateCreated: {
          present: true,
          type: 'Date',
        },
        sequenceNumber: {
          present: true,
          type: 'Integer',
        },
      });
    });
  });

  it('should have aggregateID, sequenceNumber and dateCreated', () => {
    const ev = new Event({
      aggregate_id: 'ttyy',
      sequence_number: 10000000000000000000000000000000000000,
      bar: 'me',
    });
    ev.should.have.property('aggregateID').that.equals('ttyy');
    ev.should.have.property('sequenceNumber').that.equals(10000000000000000000000000000000000000);
    ev.should.have.property('dateCreated').that.gt(0);
  });

  it('should be immutable', function test() {
    const ev = new Event({
      aggregate_id: 'abc',
      sequence_number: 1,
      bar: 'me',
    });
    ev.aggregateID = 'xyz';
    ev.sequenceNumber = 123;
    ev.bar = [89, 66];
    ev.aggregateID.should.eql('abc');
    ev.sequenceNumber.should.eql(1);
    this.skip();
    ev.bar.should.eql('me');
  });

  describe('#payload()', () => {
    it('should return original event attributes', () => {
      const ev = new Event({
        aggregate_id: 'zxc',
        sequence_number: 1,
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
      ev.payload().should.eql({
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
    });
  });

  describe('#meta()', () => {
    it('should return event\'s metadata', () => {
      const date = Date.now();
      const ev = new Event({
        aggregate_id: 'zxc',
        sequence_number: 1,
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
        date_created: date,
      });
      ev.meta().should.eql({
        aggregateID: 'zxc',
        dateCreated: date,
        sequenceNumber: 1,
      });
    });
  });

  describe('#clone()', () => {
    describe('should return event\'s deep copy', () => {
      it('when called without overriding props', () => {
        const ev = new Event({
          aggregate_id: 'asdf',
          sequence_number: 109,
          foo: [1, 5, { a: 'b' }],
          baz: { z: Buffer.alloc(6) },
        });
        const ev2 = ev.clone();
        ev2.should.be.instanceOf(Event);
        ev2.should.have.own.property('aggregateID').that.equal('asdf');
        ev2.should.have.own.property('sequenceNumber').that.equal(109);
        ev2.payload().should.eql({
          foo: [1, 5, { a: 'b' }],
          baz: { z: Buffer.alloc(6) },
        });
      });

      xit('when called with overriding props', () => {
        const ev = new Event({
          aggregate_id: 'asdf',
          sequence_number: 109,
          foo: [1, 5, { a: 'b' }],
          baz: { z: Buffer.alloc(6) },
        });
        const ev2 = ev.clone({ foo: 'changed', newProp: { g: 'h' } });
        ev2.should.be.instanceOf(Event);
        ev2.should.have.own.property('aggregateID').that.equal('asdf');
        ev2.should.have.own.property('sequenceNumber').that.equal(109);
        ev2.payload().should.eql({
          foo: 'changed',
          baz: { z: Buffer.alloc(6) },
          newProp: { g: 'h' },
        });
      });

      it('returns copy that is also immutable', () => {
        const ev = new Event({
          aggregate_id: 'asdf',
          sequence_number: 109,
          baz: 'me',
        });
        const ev2 = ev.clone();
        ev2.should.be.instanceOf(Event);
        ev2.aggregateID = 'xyz';
        ev2.sequenceNumber = 123;
        ev2.baz = [89, 66];
        ev2.aggregateID.should.eql('asdf');
        ev2.sequenceNumber.should.eql(109);
      });
    });
  });
});
