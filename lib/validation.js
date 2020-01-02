const Joi = require('@hapi/joi');

const { ValidationError } = require('./errors');


const schema = Joi;

class Validator {
  static validateEvent(event, data) {
    const eventSchema = event.constructor.fullSchema();
    const { value, error } = Joi.object(eventSchema).validate(data);
    if (error) {
      throw new ValidationError(error);
    }
    return value;
  }
}

module.exports = {
  Validator,
  schema,
};
