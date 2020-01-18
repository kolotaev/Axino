const Config = require('./configuration');
const { EventStream } = require('./stream');
const { SnapshotEvent } = require('./event');

class AggregateRoot {
  constructor(id) {
    this._id = id;
    this._uncommittedEvents = [];
    this._sequenceNumber = 1;
    this._eventStream = new EventStream({
      aggregate_type: this.constructor.name,
      aggregate_id: id,
      snapshot_threshold: this.snapshot_default_threshold,
    });
  }

  static loadFromHistory(stream, events) {
    const [firstEvent, ...restEvents] = events;
    if (firstEvent instanceof SnapshotEvent) {
      const aggregateRoot = Config.get.snapshotDataEncoder.decode(firstEvent.data);
      restEvents.forEach(ev => aggregateRoot.applyEvent(ev));
    } else {
      // todo - null?
      const aggregateRoot = new AggregateRoot(null);
      aggregateRoot.loadFromHistory(stream, events);
    }
  }

  loadFromHistory(stream, events) {
    if (events.length === 0) {
      throw new Error('History is empty');
    }
    this._eventStream = stream;
    this.clearEvents();
    this._id = events[0].aggregateID;
    this._sequenceNumber = 1;
    events.forEach(event => this.applyEvent(event));
  }

  toString() {
    return `${this.constructor.name}: ${this._id}`;
  }

  clearEvents() {
    this.uncommittedEvents = [];
  }

  applyEvent(ev) {
    // handleMessage(ev);
    this.sequenceNumber = ev.sequenceNumber + 1;
  }
}

module.exports = {
  AggregateRoot,
};
