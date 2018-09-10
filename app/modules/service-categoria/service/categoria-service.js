const logger = require('../../../config/log')({ module: 'categoria Service' });
const categoriaRepository = require('../repository/categoria-repository');
const categoriaValidate = require('../validate/categoria-validate');

class CategoriaService {
  constructor() {
    this.logger = logger;
    this.categoriaRepository = categoriaRepository;
    this.categoriaValidate = categoriaValidate;
  }

  carregar() {
    this.logger.accessLog.debug('categoriaService - Chamando categorias repository');
    return new Promise((resolve, reject) => {
      this.categoriaRepository.carregar()
        .then((categorias) => {
          if (categorias) {
            this.logger.accessLog.debug(`Retornando objetos do banco:  ${categorias.length}`);
            return resolve(categorias);
          }
          return reject();
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar carregar ${err}`);
          return reject();
        });
    });
  }

  buscarCategoriaPorCodigo(param) {
    this.logger.accessLog.debug(`Buscar categoria por codigo ${param}`);
    return new Promise((resolve, reject) => {
      this.categoriaRepository.buscarCategoriaPorCodigo(param)
        .then((result) => {
          this.logger.accessLog.debug(`categoria por codigo ${param}`, result);
          return resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar buscarcategoriaPorCodigo ${err}`);
          return reject(err);
        });
    });
  }

  cadastrar(param) {
    this.logger.accessLog.info('Executando cadastrar service', param);
    return new Promise((resolve, reject) => {
      this.categoriaRepository.inserirCategoria(param)
        .then((categoria) => {
          if (categoria) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${categoria._doc}`);
            return resolve(categoria);
          }
          return null;
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar cadastrar ${err}`);
          return reject(err);
        });
    });
  }

  atualizar(param) {
    this.logger.accessLog.info('Executando atualizar service', param);
    return new Promise((resolve, reject) => {
      this.categoriaRepository.atualizarCategoria(param)
        .then((categoria) => {
          if (categoria) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${categoria._doc}`);
            return resolve(categoria);
          }
          return null;
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar atualizar ${err}`);
          return reject(err);
        });
    });
  }

  remover(param) {
    this.logger.accessLog.info('Executando remover service', param);
    return new Promise((resolve, reject) => {
      this.categoriaRepository.removerCategoria(param)
        .then((categoria) => {
          if (categoria) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${categoria._doc}`);
            return resolve(categoria);
          }
          return null;
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar remover ${err}`);
          return reject(err);
        });
    });
  }
}
module.exports = new CategoriaService();
