const _ = require('lodash');

const { PublishEventError } = require('./errors');
const { Cloneable, EqualByValue, StringContentsRepresentable, WithValidation } = require('./mixins');
const Config = require('./configuration');
const { Schema } = require('./validation');


class Event extends WithValidation {
  static schema() {
    return {
      aggregateID: Schema.string().required(),
      sequenceNumber: Schema.number().integer().required(),
      createdAt: Schema.date().default(() => new Date(), 'current date-time'),
    };
  }

  constructor(params, opts = {}) {
    super();
    const validatedPayload = this.validate(params);

    _.forIn(validatedPayload, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }

  payload() {
    return _.chain(this)
      .pick(Object.getOwnPropertyNames(this))
      .omit(['aggregateID', 'sequenceNumber', 'createdAt'])
      .value();
  }

  meta() {
    return _.pick(this, ['aggregateID', 'sequenceNumber', 'createdAt']);
  }
}
Object.assign(Event.prototype, Cloneable);
Object.assign(Event.prototype, EqualByValue);
Object.assign(Event.prototype, StringContentsRepresentable);


class SnapshotEvent extends Event {
  static schema() {
    return {
      data: Schema.string().required(),
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
    Config.get.eventHandlers.forEach((handler) => {
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
}

module.exports = {
  Event,
  SnapshotEvent,
  EventPublisher,
};
