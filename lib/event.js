const _ = require('lodash');

const { PublishEventError } = require('./errors');
const { Cloneable, EqualByValue } = require('./mixins');
const { Validator, Schema } = require('./validation');

class Event {
  static schema() {
    return {
      aggregateID: Schema.string().required(),
      sequenceNumber: Schema.number().integer().required(),
      createdAt: Schema.date().default(() => new Date(new Date().toUTCString()), 'current date-time'),
    };
  }

  static fullSchema() {
    let clazz = this;
    const schemas = [];
    while (clazz) {
      if (_.has(clazz, 'schema')) {
        schemas.push(clazz.schema());
        clazz = Object.getPrototypeOf(clazz);
      } else {
        clazz = null;
      }
    }
    return _.reduceRight(schemas, (result, el) => _.assign(result, el), {});
  }

  constructor(params, opts = {}) {
    const validatedPayload = Validator.validateEvent(this, params);

    _.forIn(validatedPayload, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }

  payload() {
    return _.chain(this)
      .omit(['aggregateID', 'sequenceNumber', 'createdAt'])
      .omitBy(_.isFunction)
      .value();
  }

  meta() {
    return _.pick(this, ['aggregateID', 'sequenceNumber', 'createdAt']);
  }
}
Object.assign(Event.prototype, Cloneable);
Object.assign(Event.prototype, EqualByValue);


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
