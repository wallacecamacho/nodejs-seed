const Joi = require('joi');
const Extension = require('joi-date-extensions');

const JoiDate = Joi.extend(Extension);

const schema = Joi.object().keys({
  _id: Joi.string(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  nome: Joi.string().required(),
  sobreNome: Joi.string().required(),
  email: Joi.string().email().required(),
  sexo: Joi.string().max(1).required(),
  dataNascimento: JoiDate.date().format('DD-MM-YYYY').required(),
  telefone: Joi.number().integer().max(99999999999).required(),
  status: Joi.string(),
  perfil: Joi.string(),
  salt: Joi.string(),
  google: {
    id: Joi.number(),
    token: Joi.string(),
  },
  endereco: {
    estado: Joi.string().max(2),
    cidade: Joi.string(),
    bairro: Joi.string(),
    logradouro: Joi.string(),
    numero: Joi.number(),
    cep: Joi.number().max(99999999),
    geo: {
      lat: Joi.number().max(999999999999999),
      lgt: Joi.number().max(999999999999999),
    },
  },
  config: {
    avatar: Joi.string(),
  },
  lastAccess: Joi.date(),
});

module.exports = schema;
