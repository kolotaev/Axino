'use strict';

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
}

export {
  AggregateRoot
};
