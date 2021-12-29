const { MessageHandler } = require('./mixins');

class Projector extends MessageHandler {
  constructor(persister) {
    super();
    this._persister = persister;
  }
}

module.exports = Projector;
