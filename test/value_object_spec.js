require('chai').should();

const { ValueObject } = require('../lib/value_object');


class MyValueObject extends ValueObject {}

describe('ValueObject', () => {
  it('should be constructed from given params', () => {
    const vo = new MyValueObject({
      a: 'abc',
      b: 10.78,
      c: 'me',
    });
    vo.a.should.eq('abc');
    vo.b.should.eq(10.78);
    vo.c.should.eq('me');
  });

  it('should be immutable by default', () => {
    const vo = new MyValueObject({
      a: 'abc',
      b: 10.78,
      c: 'me',
    });
    vo.a = 'xyz';
    vo.b = 123;
    vo.c = [89, 66];
    vo.a.should.eq('abc');
    vo.b.should.eq(10.78);
    vo.c.should.eq('me');
  });

  it('should be mutable if explicitly set so', () => {
    const vo = new MyValueObject({
      a: 'abc',
      b: 10.78,
      c: 'me',
    }, { mutable: true });
    vo.a = 'xyz';
    vo.b = 123;
    vo.c = [89, 66];
    vo.a.should.eql('xyz');
    vo.b.should.eql(123);
    vo.c.should.eql([89, 66]);
  });

  describe('#toString()', () => {
    it('should event representation with all fields pairs exposed', () => {
      const vo = new MyValueObject({
        foo: [1, 5],
        bar: 'me',
      });
      `${vo}`.should.eq('"MyValueObject" => foo: 1,5; bar: me;');
    });
  });

  describe('#clone()', () => {
    describe('should return value object\'s deep copy', () => {
      const vo = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        baz: { z: Buffer.alloc(6) },
      });

      it('that has the same fields', () => {
        const vo2 = vo.clone();
        vo2.should.be.instanceOf(MyValueObject);
        vo2.should.have.own.property('foo').that.eql([1, 5, { a: 'b' }]);
        vo2.should.have.own.property('baz').that.eql({ z: Buffer.alloc(6) });
      });

      it('that is also immutable', () => {
        const vo2 = vo.clone();
        vo2.should.be.instanceOf(MyValueObject);
        vo2.baz = [89, 66];
        vo2.foo.should.eql([1, 5, { a: 'b' }]);
        vo2.baz.should.eql({ z: Buffer.alloc(6) });
      });

      it('that is mutable if original event was mutable', () => {
        const vo1 = new MyValueObject({
          foo: [1, 5, { a: 'b' }],
          baz: { z: Buffer.alloc(6) },
        }, { mutable: true });
        const vo2 = vo1.clone();
        vo2.should.be.instanceOf(MyValueObject);
        vo2.baz = [89, 66];
        vo2.foo.should.eql([1, 5, { a: 'b' }]);
        vo2.baz.should.eql([89, 66]);
      });
    });
  });

  describe('#equals()', () => {
    it('should return true if two objects have the same properties that are equal', () => {
      const vo1 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
      const vo2 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        bar: 'me',
      });
      vo1.equals(vo2).should.eq(true);
      vo2.equals(vo1).should.eq(true);
    });

    it('should return false if two objects have the same properties that are not equal', () => {
      const vo1 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        bar: '100',
      });
      const vo2 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        bar: 100,
      });
      vo1.equals(vo2).should.eq(false);
      vo2.equals(vo1).should.eq(false);
    });

    it('should return false if two objects have different properties', () => {
      const vo1 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
      });
      const vo2 = new MyValueObject({
        foo: [1, 5, { a: 'b' }],
        bar: 100,
      });
      vo1.equals(vo2).should.eq(false);
      vo2.equals(vo1).should.eq(false);
    });
  });
});
