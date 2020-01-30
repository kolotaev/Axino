const _ = require('lodash');


/**
 * Queue-like structure that stores all data in a JS array.
 */
class ArrayQueue {
  constructor() {
    this._queue = [];
  }

  /**
   * Put a value to a queue's end.
   *
   * @param {*} value
   * @returns {*}
   */
  push(value) {
    this._queue.push(value);
  }

  /**
   * Get a value from queue's head.
   * Removes returned value from the queue.
   *
   * @returns {*}
   */
  pop() {
    return this._queue.pop();
  }

  /**
   * Clear the contents a queue.
   *
   * @returns {void}
   */
  clear() {
    this._queue = [];
  }

  /**
   * Is queue empty?
   *
   * @returns {boolean}
   */
  isEmpty() {
    return this._queue.length <= 0;
  }
}

/**
 * Map-like structure that stores all data in a JS object.
 */
class MemoryMap {
  constructor() {
    this._container = {};
  }

  /**
   * Add to a map.
   *
   * @param {*} key
   * @param {*} value
   */
  put(key, value) {
    this._container[key] = value;
  }

  /**
   * Get from a map
   *
   * @param {*} key
   * @param {*} defaults a default value to return in case a key miss.
   * @returns {*}
   */
  get(key, defaults = null) {
    return _.get(this._container, key, defaults);
  }

  /**
   * Clear the contents a map.
   *
   * @returns {void}
   */
  clear() {
    this._container = {};
  }

  /**
   * Is map empty?
   *
   * @returns {boolean}
   */
  isEmpty() {
    return this._container.length <= 0;
  }
}

module.exports = {
  ArrayQueue,
  MemoryMap,
};
