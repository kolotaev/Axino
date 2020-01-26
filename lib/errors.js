class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class PublishEventError extends BaseError {
  constructor(handlerClass, event, cause) {
    super(`Event Handler: ${handlerClass}\nEvent: ${event}\nCause: ${cause}`);
  }
}

class ValidationError extends BaseError {}

class SnapshotTakingIsDone extends BaseError {}

class NonUniqueAggregateId extends BaseError {
  constructor(id) {
    super(`Aggregate with ID ${id} already exists`);
  }
}

class AggregateNotFound extends BaseError {
  constructor(id) {
    super(`Aggregate with ID ${id} was not found`);
  }
}

class AggregateHasUncommittedEvents extends BaseError {}


module.exports = {
  PublishEventError,
  ValidationError,
  SnapshotTakingIsDone,
  NonUniqueAggregateId,
  AggregateNotFound,
  AggregateHasUncommittedEvents,
};
