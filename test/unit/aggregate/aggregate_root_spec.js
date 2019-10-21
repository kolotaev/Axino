const should = require('chai').should();

import AggregateRoot from '../aggregate';

describe('AggregateRoot', () => {
  describe('#toString()', function() {
    it('should return aggregate class name and ID stringified representation', () => {
      let ar = new AggregateRoot(123);
      ar.should.be('asdasd');
    });
  });
});
