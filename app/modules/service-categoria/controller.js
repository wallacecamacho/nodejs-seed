const applicationError = require('../../config/errors');
const logger = require('../../config/log')({ module: 'categoria Controller' });
const categoriaService = require('./service/categoria-service');
const categoriaValidate = require('./validate/categoria-validate');
const validateBusinessError = require('../../util/custom-exceptions/validate-business-error');
const documentoExistenteError = require('../../util/custom-exceptions/documento-existente-error');


class CategoriaController {
  constructor() {
    this.logger = logger;
    this.categoriaValidate = categoriaValidate;
    this.categoriaService = categoriaService;
    this.validateBusinessError = validateBusinessError;
    this.documentoExistenteError = documentoExistenteError;
  }

  before(req, res, next) {
    this.logger.accessLog.debug(`Controller - before dados categorias ${req.params}`);
    return next();
  }

  /**
   * Carregar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  carregar(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos categorias ${req.params}`);
    this.categoriaService.carregar()
      .then((categorias) => {
        if (categorias) {
          return res.send(categorias);
        }
        return res.status(204).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar carregar ${req.params} `);
        res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Consultar Por Id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  consultarPorCodigo(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos categorias ${req.params}`);
    this.categoriaService.buscarCategoriaPorCodigo(req.params.codigo)
      .then((categorias) => {
        if (categorias) {
          return res.send(categorias);
        }
        return res.status(204).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar consultarPorCodigo ${req.params} `);
        res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }


  /**
   * Cadastrar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  cadastrar(req, res) {
    this.logger.accessLog.debug('Cadastrar dados do categoria');
    const param = req.body;
    this.categoriaService.cadastrar(param)
      .then((result) => {
        if (result) {
          res.status(200).send('Sucesso');
        }
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar cadastro de categoria ${req.params}`);
        if (err instanceof this.documentoExistenteError) {
          return res.status(403).send(applicationError.forbiddenErrorJson(err));
        }
        return res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Atualizar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  atualizar(req, res) {
    this.logger.accessLog.debug('Atualizar dados categoria');
    const param = req.body;
    this.categoriaService.atualizar(param)
      .then((result) => {
        if (result) {
          this.logger.accessLog.debug('dados categoria', result);
          return res.status(200).send('Sucesso');
        }
        return res.status(204).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar atualizar categoria ${req.params}`);
        if (err instanceof this.documentoExistenteError) {
          return res.status(403).send(applicationError.forbiddenErrorJson(err));
        }
        return res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }


  /**
 * Remover
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  remover(req, res) {
    this.logger.accessLog.debug('Remover dados categoria');
    const user = req.body;
    this.categoriaService.remover(user)
      .then((result) => {
        if (result) {
          res.status(200).send('Sucesso');
        }
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar remover categoria ${req.params}`);
        res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }
}
module.exports = new CategoriaController();
