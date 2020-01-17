require('chai').should();

const Config = require('../lib/configuration');


describe('Config', () => {
  describe('#constructor()', () => {
    it('should throw an error if user tries to instantiate class', () => {
      (() => {
        const c = new Config();
        c.get.commandHandlers.append('do something');
      }).should.throw('You can not instantiate this class. Use Config.get');
      Config.get.commandHandlers.should.eql([]);
    });
  });

  describe('.get', () => {
    it('should return default config value if config has not been extended', () => {
      Config.get.versionsTable.should.eq('axino_versions');
      Config.get.replayedIDsTable.should.eq('axino_replayed_ids');
      Config.get.eventStoreSchemaName.should.eq('axino_schema');
      Config.get.eventHandlers.should.eql([]);
    });
  });

  describe('.extend()', () => {
    it('should enrich default config values with user-specific config', () => {
      Config.extend({
        versionsTable: 'foo',
        replayedIDsTable: 'bar',
        eventStoreSchemaName: 'baz',
        eventHandlers: [1, 2, 3],
      });
      Config.get.versionsTable.should.eq('foo');
      Config.get.replayedIDsTable.should.eq('bar');
      Config.get.eventStoreSchemaName.should.eq('baz');
      Config.get.eventHandlers.should.eql([1, 2, 3]);

      Config.get.viewSchemaName.should.eq('view_schema');
      Config.get.commandHandlers.should.eql([]);
    });
  });
});
