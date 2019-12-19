class PublishEventError extends Error {
  constructor(handlerClass, event, cause) {
    const message = `Event Handler: ${handlerClass}\nEvent: ${event}\nCause: ${cause}`;
    super(message);
    this.name = 'PublishEventError';
  }
}

module.exports = {
  PublishEventError,
};
