const { EventPublisher } = require('./event');
const { SnapshotDataEncoder } = require('./encoders');
const { ArrayQueue, MemoryMap } = require('./adt');
const { AggregateRepository } = require('./aggregate');


const defaultEventPublisher = new EventPublisher(new ArrayQueue());
const defaultAggregateRepository = new AggregateRepository(new MemoryMap());


const defaultConfig = {
  versionsTable: 'axino_versions',
  replayedIDsTable: 'axino_replayed_ids',

  sqlMigrationFilesDirectory: 'db/tables',
  databaseConfigDirectory: 'db',

  viewSchemaName: 'view_schema',
  eventStoreSchemaName: 'axino_schema',

  migrationsClassName: '', // ?

  numberOfReplayProcesses: 1,

  disableEventHandlers: false,
  eventHandlers: [],
  eventPublisher: defaultEventPublisher,

  snapshotDataEncoder: new SnapshotDataEncoder(),
  snapshotThreshold: 30,

  aggregateRepository: defaultAggregateRepository,

  commandHandlers: [],
  commandFilters: [],
};

class Config {
  constructor() {
    throw new Error('You can not instantiate this class. Use Config.get');
  }

  static get get() {
    if (!this._config) {
      this._config = defaultConfig;
    }
    return this._config;
  }

  static extend(userConfig) {
    this._config = Object.assign(this.get, userConfig);
  }
}

module.exports = Config;
