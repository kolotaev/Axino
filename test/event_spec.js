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
  describe('.fullSchema()', () => {
    it('should return full inherited event schema', () => {
      class MyLocalEvent extends SnapshotEvent {
        static schema() {
          return {
            foo: Schema.string(),
          };
        }
      }
      const s = MyLocalEvent.fullSchema();
      s.should.have.keys(['aggregateID', 'data', 'createdAt', 'foo', 'sequenceNumber']);
      s.should.have.property('aggregateID').that.is.instanceOf(Schema.constructor);
      s.should.have.property('data').that.is.instanceOf(Schema.constructor);
      s.should.have.property('createdAt').that.is.instanceOf(Schema.constructor);
      s.should.have.property('foo').that.is.instanceOf(Schema.constructor);
      s.should.have.property('sequenceNumber').that.is.instanceOf(Schema.constructor);
    });
  });

  describe('.schema()', () => {
    it('should return own event schema', () => {
      class MyLocalEvent extends SnapshotEvent {
        static schema() {
          return {
            foo: { type: 'String' },
          };
        }
      }
      const s = MyLocalEvent.schema();
      s.should.have.keys(['foo']);
      s.should.not.have.keys(['aggregateID', 'data', 'createdAt', 'foo', 'sequenceNumber']);
    });

    it('should override any parent\'s fields in case of overlapping fields', () => {
      class MyLocalEvent extends Event {
        static schema() {
          return {
            aggregateID: Schema.number().integer(),
            createdAt: Schema.string(),
          };
        }
      }
      const s = MyLocalEvent.fullSchema();
      // const aggregateID = ;
      s.aggregateID.should.have.property('schemaType').that.is.eq('number');
      s.createdAt.should.have.property('schemaType').that.is.eq('string');
      s.sequenceNumber.should.have.property('schemaType').that.is.eq('number');
    });
  });

  it('should have aggregateID, sequenceNumber, createdAt and bar fields', () => {
    const ev = new MyEvent({
      aggregateID: 'ttyy',
      sequenceNumber: 100000000000000,
      bar: 'me',
    });
    ev.should.have.property('aggregateID').that.equals('ttyy');
    ev.should.have.property('sequenceNumber').that.equals(100000000000000);
    ev.should.have.property('createdAt').that.instanceOf(Date);
    ev.should.have.property('bar').that.equals('me');
  });

  it('should be immutable by default', () => {
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
    ev.bar.should.eql('me');
  });

  it('should be mutable if explicitly set so', () => {
    const ev = new MyEvent({
      aggregateID: 'abc',
      sequenceNumber: 1,
      bar: 'me',
    }, { mutable: true });
    ev.aggregateID = 'xyz';
    ev.sequenceNumber = 123;
    ev.bar = [89, 66];
    ev.aggregateID.should.eq('xyz');
    ev.sequenceNumber.should.eq(123);
    ev.bar.should.eql([89, 66]);
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
        createdAt: date,
      });
      ev.meta().should.eql({
        aggregateID: 'zxc',
        createdAt: date,
        sequenceNumber: 1,
      });
    });
  });

  describe('#clone()', () => {
    describe('should return event\'s deep copy', () => {
      it('that has the same fields', () => {
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

      it('that is also immutable', () => {
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

      it('that is mutable if original event was mutable', () => {
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
