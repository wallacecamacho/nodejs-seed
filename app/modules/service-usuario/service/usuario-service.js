const logger = require('../../../config/log')({ module: 'usuario Service' });
const usuarioRepository = require('../repository/usuario-repository');
const usuarioValidate = require('../validate/usuario-validate');
const sendEmail = require('../../../util/email/sender');

class UsuarioService {
  constructor() {
    this.logger = logger;
    this.usuarioRepository = usuarioRepository;
    this.usuarioValidate = usuarioValidate;
    this.sendEmail = sendEmail;
  }

  carregar() {
    this.logger.accessLog.debug('UsuarioService - Chamando usuarios repository');
    return new Promise((resolve, reject) => {
      this.usuarioRepository.carregar()
        .then((usuarios) => {
          if (usuarios) {
            this.logger.accessLog.debug(`Retornando objetos do banco:  ${usuarios.length}`);
            return resolve(usuarios);
          }
          return reject();
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar carregar ${err}`);
          return reject();
        });
    });
  }

  buscarUsuarioPorEmail(email) {
    this.logger.accessLog.debug(`Buscar usuario por email ${email}`);
    return new Promise((resolve, reject) => {
      this.usuarioRepository.buscarUsuarioPorEmail(email)
        .then((result) => {
          this.logger.accessLog.debug(`usuario por email ${email}`, result);
          return resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(err);
        });
    });
  }

  cadastrar(param) {
    this.logger.accessLog.info('Executando cadastrar service', param);
    return new Promise((resolve, reject) => {
      this.usuarioRepository.inserirUsuario(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._id}`);
            this.sendEmail(usuario.email, 'Bem vindo', 'tpl_welcome.html', usuario);
            return resolve(usuario);
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
      this.usuarioRepository.atualizarUsuario(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);
            return resolve(usuario);
          }
          return resolve(null);
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
      this.usuarioRepository.removerUsuario(param)
        .then((usuario) => {
          if (usuario) {
            this.logger.accessLog.info(`retornando objeto do banco de dados ${usuario._doc}`);
            return resolve(usuario);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`Erro ao executar remover ${err}`);
          return reject(err);
        });
    });
  }
}
module.exports = new UsuarioService();
