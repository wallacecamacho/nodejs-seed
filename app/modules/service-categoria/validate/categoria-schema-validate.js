const Joi = require('joi');

const schema = Joi.object().keys({
  _id: Joi.string(),
  nome: Joi.string().required(),
  codigo: Joi.string().required(),
  descricao: Joi.string().required(),
});

module.exports = schema;
