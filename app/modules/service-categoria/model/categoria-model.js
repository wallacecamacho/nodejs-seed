const mongoose = require('mongoose');
const db = require('../../../config/database');

const schema = new mongoose.Schema({
  codigo: {
    type: String, index: true, unique: true, uppercase: true, required: [true, 'código é obrigatório!'],
  },
  nome: { type: String, lowercase: true, required: [true, 'nome é obrigatório!'] },
  descricao: { type: String, lowercase: true, required: [true, 'descrição é obrigatório!'] },
}, {
  collection: 'Categorias',
  additionalProperties: false,
  versionKey: false,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

schema.virtual('id').get(function () {
  return this._id;
});

module.exports = db.mongooseConnection().model('Categorias', schema);
