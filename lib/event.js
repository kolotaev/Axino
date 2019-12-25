const _ = require('lodash');

const { PublishEventError } = require('./errors');
const { ImmutableCloneable } = require('./mixins');

class Event {
  constructor(params) {
    if (!params.aggregate_id) {
      // todo: use camelcase everywhere?
      throw Error('Missing aggregate_id');
    }
    if (!params.sequence_number) {
      throw Error('Missing sequence_number');
    }
    this.aggregateID = params.aggregate_id;
    this.sequenceNumber = params.sequence_number;

    if (!params.date_created) {
      this.dateCreated = Date.now();
    } else {
      this.dateCreated = params.date_created;
    }

    _.chain(params)
      .omit(['aggregate_id', 'sequence_number', 'date_created'])
      .each((k, v) => { this[k] = v; });


    if (this.constructor === Event) {
      Object.freeze(this);
    }
  }

  payload() {
    return _.omit(this, ['aggregateID', 'sequenceNumber', 'dateCreated']);
  }

  meta() {
   _.chain(this)
    .forOwn(_.identity)
    .tap(x => console.log(x))
    .omit(['aggregateID', 'sequenceNumber', 'dateCreated'])

    return [];
  }
}
Object.assign(Event.prototype, ImmutableCloneable);

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
