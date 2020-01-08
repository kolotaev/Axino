class BaseCommand {
  constructor(args = {}) {
    this._params = args;
    this.createdAt = Date.now();
  }
}

class Commands {}

module.exports = {
  BaseCommand,
  Commands,
};
