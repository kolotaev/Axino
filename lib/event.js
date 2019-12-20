const { PublishEventError } = require('./errors');

class Event {
  constructor(params) {
    if (!params.aggregate_id) {
      throw Error('Missing aggregate_id');
    }
    if (!params.sequence_number) {
      throw Error('Missing sequence_number');
    }
    this.aggregateID = params.aggregate_id;
    this.sequenceNumber = params.sequence_number;
    if (!params.date_created) {
      this.dateCreated = Date.now();
    }
    delete params.aggregate_id;
    delete params.sequence_number;
    this._payloadData = params;
  }

  get payload() {
    return this._payload_data;
  }
}

class SnapshotEvent extends Event {
  static schema() {
    return {
      data: 'String',
    };
  }
}

class EventPublisher {
  publishEvents(events) {
    if (this.config.disableEventHandlers) {
      return;
    }
    events.forEach(event => this._eventsQueue.push(event));
    this.processEvents();
  }

  processEvents() {
    try {
      while (!this._eventsQueue.empty) {
        const ev = this._eventsQueue.pop();
        this.processEvent(ev);
      }
    } finally {
      this._eventsQueue.clear();
    }
  }

  processEvent(event) {
    this.config.eventHandlers.forEach((handler) => {
      try {
        handler.handleMessage(event);
      } catch (ex) {
        throw PublishEventError(handler, event);
      }
    });
  }

  static get _eventsQueue() {
    return [];
  }

  get config() {
    return this.config;
  }
}

module.exports = {
  Event,
  SnapshotEvent,
  EventPublisher,
};
