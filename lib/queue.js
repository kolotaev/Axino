class DefaultEventsQueue {
  constructor() {
    this._queue = [];
  }

  push(event) {
    this._queue.push(event);
  }

  pop() {
    return this._queue.pop();
  }

  clear() {
    this._queue = [];
  }

  isEmpty() {
    return this._queue.length <= 0;
  }
}

module.exports = {
  DefaultEventsQueue,
};
