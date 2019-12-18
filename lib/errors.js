class PublishEventError extends Error {
  constructor(handlerClass, event) {
    const message = `Event Handler: ${handlerClass}\nEvent: ${event}\nCause: ${this.message}`;
    super(message);
  }

  toString() {
    return this.name;
  }
}

module.exports = {
  PublishEventError,
};
