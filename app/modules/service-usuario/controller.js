const applicationError = require('../../config/errors');
const logger = require('../../config/log')({ module: 'usuario Controller' });
const usuarioService = require('./service/usuario-service');
const usuarioValidate = require('./validate/usuario-validate');
const validateBusinessError = require('../../util/custom-exceptions/validate-business-error');
const usuarioExistenteError = require('../../util/custom-exceptions/documento-existente-error');

class UsuarioController {
  constructor() {
    this.logger = logger;
    this.usuarioValidate = usuarioValidate;
    this.usuarioService = usuarioService;
    this.validateBusinessError = validateBusinessError;
    this.usuarioExistenteError = usuarioExistenteError;
  }

  before(req, res, next) {
    this.logger.accessLog.debug(`Controller - before dados dos usuarios ${req.params}`);
    return next();
  }

  /**
   * Carregar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  carregar(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos usuarios ${req.params}`);
    this.usuarioService.carregar()
      .then((usuarios) => {
        if (usuarios) {
          return res.send(usuarios);
        }
        return res.status(204).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar carregar ${req.params} `);
        return res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }

  /**
   * Consultar Por Id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  consultarPorEmail(req, res) {
    this.logger.accessLog.debug(`Controller - Carregando dados dos usuarios ${req.params}`);
    this.usuarioService.buscarUsuarioPorEmail(req.params.email)
      .then((usuarios) => {
        if (usuarios) {
          return res.send(usuarios);
        }
        return res.status(204).send();
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar consultarPorEmail ${req.params} `);
        return res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }


  /**
   * Cadastrar
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  cadastrar(req, res) {
    this.logger.accessLog.debug('Cadastrar dados do usuario');
    const user = req.body;
    this.usuarioService.cadastrar(user)
      .then((result) => {
        if (result) {
          res.status(200).send('Sucesso');
        }
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar cadastro de usuário ${req.params}`);
        if (err instanceof usuarioExistenteError) {
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
    this.logger.accessLog.debug('Atualizar dados do usuario');
    const user = req.body;
    this.usuarioService.atualizar(user)
      .then((result) => {
        this.logger.accessLog.debug('atualizado dados do usuario', result);
        return res.status(200).send('Sucesso');
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar atualizar de usuário ${req.params}`);
        if (err instanceof usuarioExistenteError) {
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
    this.logger.accessLog.debug('Remover dados do usuario');
    const user = req.body;
    this.usuarioService.remover(user)
      .then((result) => {
        this.logger.accessLog.debug('retorno remover usuario', result);
        return res.status(200).send('Sucesso');
      }).catch((err) => {
        this.logger.accessLog.error(`Controller - erro ao executar remover usuário ${req.params}`);
        return res.status(500).send(applicationError.internalServerErrorJson(err));
      });
  }
}
module.exports = new UsuarioController();
