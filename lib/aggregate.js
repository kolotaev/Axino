const _ = require('lodash');

const Config = require('./configuration');
const { EventStream } = require('./stream');
const { SnapshotEvent } = require('./event');
const { MessageHandler } = require('./mixins');
const { Command, BasicCommand, CommandHandler } = require('./command');
const { Schema } = require('./validation');
const { SnapshotTakingIsDone, NonUniqueAggregateId, AggregatesNotFound } = require('./errors');


class AggregateRoot extends MessageHandler {
  constructor(id) {
    super();
    this._id = id;
    this._uncommittedEvents = [];
    this._sequenceNumber = 1;
    this._eventStream = new EventStream(this.constructor.name, id, Config.get.snapshotThreshold);
  }

  static loadFromHistory(stream, events) {
    const [firstEvent, ...restEvents] = events;
    if (firstEvent instanceof SnapshotEvent) {
      const aggregateRoot = Config.get.snapshotDataEncoder.decode(firstEvent.data);
      restEvents.forEach(ev => aggregateRoot.applyEvent(ev));
      return aggregateRoot;
    }
    // todo - null?
    const aggregateRoot = new this.constructor(null);
    aggregateRoot.loadFromHistory(stream, events);
    return aggregateRoot;
  }

  loadFromHistory(stream, events) {
    if (events.length === 0) {
      throw new Error('History is empty');
    }
    this._eventStream = stream;
    this._uncommittedEvents = [];
    this._id = events[0].aggregateID;
    this._sequenceNumber = 1;
    events.forEach(event => this.applyEvent(event));
  }

  toString() {
    return `${this.constructor.name}: ${this._id}`;
  }

  get uncommittedEvents() {
    return this._uncommittedEvents;
  }

  takeSnapshot() {
    const snapshot = this.buildEvent(SnapshotEvent, {
      data: Config.get.snapshotDataEncoder.encode(this),
    });
    this.uncommittedEvents.push(snapshot);
  }

  applyEvent(ev) {
    this.handleMessage(ev);
    this.sequenceNumber = ev.sequenceNumber + 1;
  }

  buildEvent(eventClass, params = {}) {
    const allParams = Object.assign(params, {
      aggregateID: this._id,
      sequenceNumber: this.sequenceNumber,
    });
    return new eventClass(allParams);
  }

  apply(eventClass, params = {}) {
    // todo - if it's a class
    // todo - applyifchanged
    const ev = this.buildEvent(eventClass, params);
    this.applyEvent(ev);
    this.uncommittedEvents.push(ev);
  }
}

class SnapshotCommand extends BasicCommand {
  static schema() {
    return {
      // todo - move schema to this
      limit: Schema.number().integer(),
    };
  }
}

class TakeSnapshotCommand extends Command {}


class AggregateSnapshotTaker extends CommandHandler {
  static on() {
    return {
      SnapshotCommand: (cmd) => {
        const aggregateIDs = this.repository.eventStore.aggregatesThatNeedSnapshots(
          this.lastAggregateID, cmd.limit,
        );
        aggregateIDs.forEach(id => this.takeSnapshot(id));
        // is it needed?
        this.lastAggregateID = _.last(aggregateIDs);
        // todo - null?
        if (this.lastAggregateID == null) {
          // simple return?
          throw new SnapshotTakingIsDone();
        }
      },

      TakeSnapshotCommand: cmd => this.takeSnapshot(cmd.aggregateID),
    };
  }

  takeSnapshot(aggregateID) {
    try {
      const aggregate = this.repository.loadAggregate(aggregateID);
      Config.get.logger.info(`Taking snapshot of Aggregate ${aggregate}`);
      aggregate.takeSnapshot();
    } catch (ex) {
      Config.get.logger.error(`Failed to take snapshot of Aggregate with ID ${aggregateID}, reason: ${ex}`);
    }
  }
}

class AggregateRepository {
  constructor(aggregatesStore) {
    this._store = aggregatesStore;
  }

  add(aggregate) {
    const existing = this._store.get(aggregate.id);
    if (existing && existing.id === aggregate.id) {
      throw new NonUniqueAggregateId(existing.id);
    }
    this._store.put(aggregate.id, aggregate);
  }

  loadAggregates(...ids) {
    if (ids.length === 0) {
      return [];
    }
    const aggregateIDs = _.uniq(ids);
    let aggregates = [];
    aggregateIDs.forEach((id) => {
      const a = this._store.get(id);
      if (a) {
        aggregates.push(a);
      }
    });

    const foundIDs = _.chain(aggregates).pick('id').value();
    const queryIDs = _.difference(aggregateIDs, foundIDs);

    const loadedAggregates = _.map(Config.get.eventStore.loadEvents(queryIDs), (stream, events) => {
      const kl = stream.stream.aggregateType.constructor;
      return kl.loadFromHistory(stream, events);
    });

    // todo - improve perf
    aggregates = _.concat(aggregates, loadedAggregates);
    if (aggregates.length !== aggregateIDs.length) {
      throw new AggregatesNotFound(aggregateIDs - _.chain(aggregates).pick('id').value());
    }

    // todo - improve perf
    aggregates.forEach(a => this._store.put(a.id, a));

    return aggregates;
  }
}


module.exports = {
  AggregateRoot,
  AggregateSnapshotTaker,
  AggregateRepository,
};
