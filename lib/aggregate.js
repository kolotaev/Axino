const { EventStream } = require('./stream');
const { SnapshotEvent } = require('./event');

class AggregateRoot {
  constructor(id) {
    this.id = id;
    this.uncommittedEvents = [];
    this.sequenceNumber = 1;
    this.eventStream = new EventStream({
      aggregate_type: this.constructor.name,
      aggregate_id: id,
      snapshot_threshold: this.snapshot_default_threshold
    });
  }

  static loadFromHistory(stream, events) {
    let firstEvent, restEvents;
    [firstEvent, ...restEvents] = events;
    if (firstEvent instanceof SnapshotEvent) {
      const buf = new Buffer(firstEvent.data, 'base64');
      const aggregateRoot = buff.toString('utf-8');
      restEvents.forEach(ev => {
        aggregateRoot.applyEvent(ev);
      });
    } else {
      // todo - null?
      const aggregateRoot = new AggregateRoot(null);
      aggregateRoot.loadFromHistory(stream, events);
    }
  }

  loadFromHistory(stream, events) {
    if (events.length == 0) {
      throw new Error('History is empty');
    }
    this.eventStream = stream;
    this.clearEvents();
    this.id = events[0].aggregateID;
    this.sequenceNumber = 1;
    events.forEach(event => {
      this.applyEvent(event);
    });
  }

  toString() {
    return `${this.constructor.name}: ${this.id}`;
  }

  clearEvents() {
    this.uncommittedEvents = [];
  }

  applyEvent(ev) {
    handleMessage(ev);
    this.sequenceNumber = ev.sequenceNumber + 1;
  }
}

module.exports = {
  AggregateRoot
}
