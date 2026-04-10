const schemas = require("./schemas");

const validate = (schema, payload) => {
  const validationResult = schema.validate(payload);
  if (validationResult.error) {
    const error = new Error(validationResult.error.message);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { ...schemas, validate };
