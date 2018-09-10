/* global it, describe, after, before */

const request = require('superagent');
const expect = require('chai').expect;
const config = require('../../../../config');
const testPayload = require('./testPayload');

/**
 * Arrow Functions
 * Passing arrow functions (“lambdas”) to Mocha is discouraged.
 * Lambdas lexically bind this and cannot access the Mocha context.
 */

before(() => {
  this.returnPayload = null;
});

after(() => {
  this.returnPayload = null;
});

describe.only('Categoria', () => {
  it('Deve buscar categorias', () => request.get(`${config.app.host}:${config.app.port}${config.app.baseRoute}/categorias`)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      expect(res.ok).to.be.true;
      expect(res.body).to.be.an('array');
    }));

  it('Deve Inserir categoria', () => request.put(`${config.app.host}:${config.app.port}${config.app.baseRoute}/categoria`)
    .set('accept', 'json')
    .send(testPayload)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      expect(res.ok).to.be.true;
    }));

    it('Deve Buscar Categoria Por Código', () => request.get(`${config.app.host}:${config.app.port}${config.app.baseRoute}/categoria/${testPayload.codigo}`)
    .set('accept', 'json')
    .send(testPayload)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      this.returnPayload = {
        _id: res.body._id,
        nome: res.body.nome,
        codigo: res.body.codigo,
        descricao: res.body.descricao,
      };
      expect(res.ok).to.be.true;
    }));

    it('Deve Atualizar categoria', () => request.post(`${config.app.host}:${config.app.port}${config.app.baseRoute}/categoria`)
    .set('accept', 'json')
    .send(this.returnPayload)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      expect(res.ok).to.be.true;
    }));

    it('Deve Remover categoria', () => request.delete(`${config.app.host}:${config.app.port}${config.app.baseRoute}/categoria`)
    .set('accept', 'json')
    .send(this.returnPayload)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      expect(res.ok).to.be.true;
    }));
});
