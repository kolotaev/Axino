class BaseCommand {
  constructor(args = {}) {
    this._params = args;
    this.dateCreated = Date.now();
  }
}

class Commands {}

module.exports = {
  BaseCommand,
  Commands,
};
