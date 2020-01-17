const Joi = require('@hapi/joi');

const { ValidationError } = require('./errors');


// Alias for exposing via own name.
// Is helpful for abstracting away real implementation.
const Schema = Joi;

class Validator {
  static validate(schemaData, data) {
    const { value, error } = Schema.object(schemaData).validate(data);
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
