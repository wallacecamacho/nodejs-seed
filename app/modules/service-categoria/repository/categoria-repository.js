const logger = require('../../../config/log')({ module: 'Categoria Repository' });
const CategoriaModel = require('../model/categoria-model');
const applicationError = require('../../../config/errors');

class CategoriaRepository {
  constructor() {
    this.logger = logger;
    this.CategoriaModel = CategoriaModel;
    this.applicationError = applicationError;
  }

  carregar() {
    return new Promise((resolve) => {
      this.CategoriaModel.find()
        .then((result) => {
          if (result) {
            this.logger.accessLog.debug(`carregar::CategoriaRepository - Retornou objeto do banco: ${result.length}`);
          }
          resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`carregar::Erro ao executar carregar ${err}`);
        });
    });
  }

  inserirCategoria(param) {
    this.logger.accessLog.info('inserirCategoria::Inserindo objeto no banco');
    return new Promise((resolve, reject) => {
      const Categoria = new this.CategoriaModel(param);
      const validate = Categoria.validateSync();
      if (!validate) {
        Categoria.save((err, result) => {
          if (err) {
            if (err.code === 11000) {
              logger.accessLog.error('inserirCategoria::Objeto Atualizado documento já existe na base de dados', err);
              return reject(applicationError.throwsDocumentoExistenteError('Categoria existente na base de dados'));
            }
          }
          logger.accessLog.info('inserirCategoria::Objeto inserido no banco: ', `${result._id}`);
          return resolve(result);
        });
      } else {
        return reject(validate);
      }
      return null;
    });
  }

  atualizarCategoria(param) {
    this.logger.accessLog.info('atualizarCategoria::Atualizar objeto no banco');
    return new Promise((resolve) => {
      this.CategoriaModel.findByIdAndUpdate(param._id, param).exec()
        .then((result) => {
          if (result.isNew) {
            this.logger.accessLog.info('atualizarCategoria::Objeto atualizado no banco: ', result._id);
            resolve(result);
          }
          this.logger.accessLog.info('atualizarCategoria::Objeto atualizado documento já existe na base de dados', result._id);
          resolve(result._doc);
        })
        .catch((err) => {
          this.logger.accessLog.info('atualizarCategoria::Erro ao atualizar', err);
        });
    });
  }

  removerCategoria(param) {
    this.logger.accessLog.info('removerCategoria::Remover objeto no banco');
    return new Promise((resolve) => {
      const Categoria = new CategoriaModel(param);
      Categoria.remove(param)
        .then((result) => {
          if (result.isNew) {
            this.logger.accessLog.info('removerCategoria::Objeto removido no banco: ', result._id);
            resolve(result);
          }
          this.logger.accessLog.info('removerCategoria::Objeto removido documento já existe na base de dados', result._id);
          resolve(result._doc);
        })
        .catch((err) => {
          this.logger.accessLog.info('removerCategoria::Erro ao executar remover Categoria ', err);
        });
    });
  }

  buscarCategoriaPorCodigo(param) {
    return new Promise((resolve) => {
      this.CategoriaModel.findOne({ codigo: param }).exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.debug(`buscarCategoriaPorCodigo::Retornando objetos do banco: ${result.length}`);
            return resolve(result);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`buscarCategoriaPorCodigo::Erro ao executar buscarCategoriaPorCodigo ${err}`);
        });
    });
  }
}
module.exports = new CategoriaRepository();
