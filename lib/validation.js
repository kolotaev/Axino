class Validator {
  validateEvent(event) {
    const schema = event.constructor.fullSchema();
    try {
      this.validatorBackend.validate(schema);
    } catch (e) {
      return false;
    }
    return true;
  }
}

module.exports = {
  Validator,

};
