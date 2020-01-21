const Config = require('./configuration');
const { EventStream } = require('./stream');
const { SnapshotEvent } = require('./event');
const { MessageHandler } = require('./mixins');


class AggregateRoot extends MessageHandler {
  constructor(id) {
    super();
    this._id = id;
    this._uncommittedEvents = [];
    this._sequenceNumber = 1;
    this._eventStream = new EventStream(this.constructor.name, id, Config.get.snapshotThreshold);
  }

  static loadFromHistory(stream, events) {
    const [firstEvent, ...restEvents] = events;
    if (firstEvent instanceof SnapshotEvent) {
      const aggregateRoot = Config.get.snapshotDataEncoder.decode(firstEvent.data);
      restEvents.forEach(ev => aggregateRoot.applyEvent(ev));
      return aggregateRoot;
    }
    // todo - null?
    const aggregateRoot = new this.constructor(null);
    aggregateRoot.loadFromHistory(stream, events);
    return aggregateRoot;
  }

  loadFromHistory(stream, events) {
    if (events.length === 0) {
      throw new Error('History is empty');
    }
    this._eventStream = stream;
    this._uncommittedEvents = [];
    this._id = events[0].aggregateID;
    this._sequenceNumber = 1;
    events.forEach(event => this.applyEvent(event));
  }

  toString() {
    return `${this.constructor.name}: ${this._id}`;
  }

  get uncommittedEvents() {
    return this._uncommittedEvents;
  }

  takeSnapshot() {
    const snapshot = this.buildEvent(SnapshotEvent, {
      data: Config.get.snapshotDataEncoder.encode(this),
    });
    this.uncommittedEvents.push(snapshot);
  }

  applyEvent(ev) {
    this.handleMessage(ev);
    this.sequenceNumber = ev.sequenceNumber + 1;
  }

  buildEvent(eventClass, params = {}) {
    const allParams = Object.assign(params, {
      aggregateID: this._id,
      sequenceNumber: this.sequenceNumber,
    });
    return new eventClass(allParams);
  }

  apply(eventClass, params = {}) {
    // todo - if it's a class
    // todo - applyifchanged
    const ev = this.buildEvent(eventClass, params);
    this.applyEvent(ev);
    this.uncommittedEvents.push(ev);
  }
}


module.exports = {
  AggregateRoot,
};
