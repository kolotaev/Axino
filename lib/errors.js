class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class PublishEventError extends BaseError {
  constructor(handlerClass, event, cause) {
    const message = `Event Handler: ${handlerClass}\nEvent: ${event}\nCause: ${cause}`;
    super(message);
  }
}

class ValidationError extends BaseError {}

module.exports = {
  PublishEventError,
  ValidationError,
};
