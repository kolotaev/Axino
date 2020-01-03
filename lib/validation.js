const Joi = require('@hapi/joi');

const { ValidationError } = require('./errors');


// Alias for exposing via own name.
// Is helpful for abstracting away real implementation.
const Schema = Joi;

class Validator {
  static validateEvent(event, data) {
    const eventSchema = event.constructor.fullSchema();
    const { value, error } = Schema.object(eventSchema).validate(data);
    if (error) {
      throw new ValidationError(error);
    }
    return value;
  }
}

module.exports = {
  Validator,
  Schema,
};
