const Config = require('./configuration');


class EventStore {
  commitEvents(command, eventStreams) {
    this.storeEvents(command, eventStreams);
    eventStreams.forEach(([stream, events]) => {
      if (stream) {
        return;
      }
      this.publishEvents(events);
    });
  }

  storeEvents(command, eventStreams) {
    if (command && eventStreams) {
      return;
    }
    throw new Error('not impl');
  }

  publishEvents(events) {
    Config.get.eventPublisher.publishEvents(events);
  }

  loadEvents(aggregateIDs) {
    if (aggregateIDs) {
      return [];
    }
    return [];
  }

  streamExists(aggregateID) {
    if (aggregateID) {
      return false;
    }
    return false;
  }
}

module.exports = EventStore;
