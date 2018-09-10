const Joi = require('joi');
const logger = require('../../../config/log')({ module: 'categoria Validate' });
const schema = require('./categoria-schema-validate');
const applicationError = require('../../../config/errors');

class CategoriaValidate {
  constructor() {
    this.logger = logger;
    this.schema = schema;
    this.joi = Joi;
  }

  validatSchema(req, res, next) {
    this.logger.accessLog.debug('Valida request Categoria');
    const params = req.body;
    const resultValidate = Joi.validate(params, schema);

    if (resultValidate.error !== null) {
      return res.status(400).send(applicationError.throw(resultValidate.error.message, 'BadRequest'));
    }
    return next();
  }
}
module.exports = new CategoriaValidate();
