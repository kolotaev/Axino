const Config = require('./configuration');


class EventStore {
  commitEvents(command, eventStreams) {
    this.storeEvents(command, eventStreams);
    eventStreams.forEach(([stream, events]) => {
      this.publishEvents(events);
    });
  }

  storeEvents(command, eventStreams) {
    throw new Error('not impl');
  }

  publishEvents(events) {
    Config.get.eventPublisher.publishEvents(events);
  }

  loadEvents(aggregateIDs) {
    return [];
  }
}

module.exports = EventStore;
