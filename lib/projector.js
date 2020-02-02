const { MessageHandler } = require('./mixins');

class Projector extends MessageHandler {
  constructor(persistor) {
    super();
    this._persistor = persistor
  }
}

module.exports = Projector;
