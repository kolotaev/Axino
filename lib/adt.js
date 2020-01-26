const _ = require('lodash');


class ArrayQueue {
  constructor() {
    this._queue = [];
  }

  push(value) {
    this._queue.push(value);
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

class MemoryMap {
  constructor() {
    this._container = {};
  }

  put(key, value) {
    this._container[key] = value;
  }

  get(key, defaults = undefined) {
    return _.get(this._container, key, defaults);
  }

  clear() {
    this._container = {};
  }

  isEmpty() {
    return this._container.length <= 0;
  }
}

module.exports = {
  ArrayQueue,
  MemoryMap,
};
