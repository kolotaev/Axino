class PublishEventError extends Error {
  constructor(handler_class, event) {
    message = `Event Handler: ${handler_class}\nEvent: ${event}\nCause: ${super.message}`
    super(message);
    this.name = "PublishEventError";
  }
}
