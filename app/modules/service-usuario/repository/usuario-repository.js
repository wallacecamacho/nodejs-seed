const logger = require('../../../config/log')({ module: 'usuario Repository' });
const UsuarioModel = require('../model/usuario-model');
const applicationError = require('../../../config/errors');

class UsuarioRepository {
  constructor() {
    this.logger = logger;
    this.UsuarioModel = UsuarioModel;
    this.applicationError = applicationError;
  }

  carregar() {
    return new Promise((resolve) => {
      this.UsuarioModel.find().select(
        '_id endereco config sexo dataNascimento telefone status perfil updatedAt lastAccess nome sobreNome email').exec()
        .then((result) => {
          if (result) {
            this.logger.accessLog.debug(`carregar::UsuarioRepository - Retornou objeto do banco: ${result.length}`);
          }
          return resolve(result);
        })
        .catch((err) => {
          this.logger.accessLog.debug(`carregar::Erro ao executar carregar ${err}`);
        });
    });
  }

  inserirUsuario(param) {
    this.logger.accessLog.info('inserirUsuario::Inserindo objeto no banco');
    return new Promise((resolve, reject) => {
      const user = new this.UsuarioModel(param);
      user.status = 'ATIV';
      user.encryptPassword(param.password);
      const validate = user.validateSync();
      if (!validate) {
        user.save((err, result) => {
          if (err) {
            if (err.code === 11000) {
              logger.accessLog.error('inserirUsuario::Objeto Atualizado documento já existe na base de dados', err);
              return reject(applicationError.throwsDocumentoExistenteError('Usuário existente na base de dados'));
            }
          }
          logger.accessLog.info('inserirUsuario::Objeto inserido no banco: ', `${result._id}`);
          return resolve(result);
        });
      } else {
        return reject(validate);
      }
      return null;
    });
  }

  atualizarUsuario(param) {
    this.logger.accessLog.info('atualizarUsuario::Atualizar objeto no banco');
    return new Promise((resolve) => {
      this.UsuarioModel.findByIdAndUpdate(param._id, param).exec()
        .then((result) => {
          if (result.isNew) {
            this.logger.accessLog.info('atualizarUsuario::Objeto atualizado no banco: ', result._id);
            return resolve(result);
          }
          this.logger.accessLog.info('atualizarUsuario::Objeto atualizado documento já existe na base de dados', result._id);
          return resolve(result._doc);
        })
        .catch((err) => {
          this.logger.accessLog.info('atualizarUsuario::Erro ao atualizar', err);
        });
    });
  }

  removerUsuario(param) {
    this.logger.accessLog.info('removerUsuario::Remover objeto no banco');
    return new Promise((resolve) => {
      const user = new UsuarioModel(param);
      user.status = 'DESAT';
      UsuarioModel.findByIdAndUpdate(param._id, param).exec()
        .then((result) => {
          if (result.isNew) {
            this.logger.accessLog.info('removerUsuario::Objeto removido no banco: ', result._id);
            return resolve(result);
          }
          this.logger.accessLog.info('removerUsuario::Objeto removido documento já existe na base de dados', result._id);
          return resolve(result._doc);
        })
        .catch((err) => {
          this.logger.accessLog.info('removerUsuario::Erro ao executar remover usuario ', err);
        });
    });
  }

  buscarUsuarioPorEmail(param) {
    return new Promise((resolve, reject) => {
      this.UsuarioModel.findOne({ email: param })
        .select('_id endereco config sexo dataNascimento telefone status perfil updatedAt lastAccess nome sobreNome email').exec()
        .then((result) => {
          if (result.length > 0) {
            this.logger.accessLog.debug(`buscarUsuarioPorEmail::Retornando objetos do banco: ${result.length}`, this.UsuarioModel.toJson());
            return resolve(result);
          }
          return resolve(null);
        })
        .catch((err) => {
          this.logger.accessLog.error(`buscarUsuarioPorEmail::Erro ao executar buscarUsuarioPorEmail ${err}`);
          return reject(new Error('buscarUsuarioPorEmail::Erro ao executar a consulta'));
        });
    });
  }
}
module.exports = new UsuarioRepository();
