const _ = require('lodash');

const { PublishEventError } = require('./errors');
const { ImmutableCloneable } = require('./mixins');
const { Validator, schema } = require('./validation');

class Event {
  static schema() {
    return {
      aggregateID: schema.string().required(),
      sequenceNumber: schema.number().integer().required(),
      dateCreated: schema.date().default(Date.now, 'current date-time'),
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
      .omit(['aggregateID', 'sequenceNumber', 'dateCreated'])
      .omitBy(_.isFunction)
      .value();
  }

  meta() {
    return _.pick(this, ['aggregateID', 'sequenceNumber', 'dateCreated']);
  }
}
Object.assign(Event.prototype, ImmutableCloneable);


class SnapshotEvent extends Event {
  static schema() {
    return {
      data: schema.string().required(),
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
