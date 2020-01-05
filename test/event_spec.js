require('chai').should();

const { Event, SnapshotEvent } = require('../lib/event');
const { Schema } = require('../lib/validation');

class MyEvent extends Event {
  static schema() {
    return {
      foo: Schema.any(),
      bar: Schema.any(),
      baz: Schema.any(),
    };
  }
}

describe('Event', () => {
  xdescribe('.fullSchema()', () => {
    it('should return full inherited event schema', () => {
      class MyEvent extends SnapshotEvent {
        static schema() {
          return {
            foo: { type: 'String' },
          };
        }
      }
      MyEvent.fullSchema().should.eql({
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

  xdescribe('.schema()', () => {
    it('should return own event schema', () => {
      class MyEvent extends SnapshotEvent {
        static schema() {
          return {
            foo: { type: 'String' },
          };
        }
      }
      MyEvent.schema().should.eql({
        foo: {
          type: 'String',
        },
      });
    });

    it('should override any parent\'s fields in case of overlapping fields', () => {
      class MyEvent extends Event {
        static schema() {
          return {
            aggregateID: { type: 'Integer' },
          };
        }
      }
      MyEvent.fullSchema().should.eql({
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

  it('should have aggregateID, sequenceNumber, dateCreated and bar fields', () => {
    const ev = new MyEvent({
      aggregateID: 'ttyy',
      sequenceNumber: 100000000000000,
      bar: 'me',
    });
    ev.should.have.property('aggregateID').that.equals('ttyy');
    ev.should.have.property('sequenceNumber').that.equals(100000000000000);
    ev.should.have.property('dateCreated').that.gt(0);
    ev.should.have.property('bar').that.equals('me');
  });

  it('should be immutable', function test() {
    const ev = new MyEvent({
      aggregateID: 'abc',
      sequenceNumber: 1,
      bar: 'me',
    });
    ev.aggregateID = 'xyz';
    ev.sequenceNumber = 123;
    ev.bar = [89, 66];
    ev.aggregateID.should.eq('abc');
    ev.sequenceNumber.should.eq(1);
    this.skip();
    ev.bar.should.eql('me');
  });

  describe('#payload()', () => {
    it('should return original event attributes', () => {
      const ev = new MyEvent({
        aggregateID: 'zxc',
        sequenceNumber: 1,
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
      const date = new Date('2018-01-24T12:38:29.069Z');
      const ev = new MyEvent({
        aggregateID: 'zxc',
        sequenceNumber: 1,
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
        dateCreated: date,
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
        const ev = new MyEvent({
          aggregateID: 'asdf',
          sequenceNumber: 109,
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

      it('returns copy that is also immutable', () => {
        const ev = new MyEvent({
          aggregateID: 'asdf',
          sequenceNumber: 109,
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

      it('returns copy that is also mutable if original event was mutable', () => {
        const ev = new MyEvent({
          aggregateID: 'asdf',
          sequenceNumber: 109,
          baz: 'me',
        }, { mutable: true });
        const ev2 = ev.clone();
        ev2.should.be.instanceOf(Event);
        ev2.aggregateID = 'xyz';
        ev2.sequenceNumber = 123;
        ev2.baz = [89, 66];
        ev2.aggregateID.should.eql('xyz');
        ev2.sequenceNumber.should.eql(123);
        ev2.baz.should.eql([89, 66]);
      });
    });
  });
});
