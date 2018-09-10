const express = require('express');

const router = express.Router();
const controller = require('./controller');
const controllerValidate = require('./validate/categoria-validate');
const route = require('../../config/route');

const info = route.info(__filename);

router.get('/categorias', controller.before.bind(controller), controller.carregar.bind(controller));

router.get('/categoria/:codigo', controller.consultarPorCodigo.bind(controller));

router.put('/categoria', controllerValidate.validatSchema.bind(controller), controller.cadastrar.bind(controller));

router.post('/categoria', controllerValidate.validatSchema.bind(controller), controller.atualizar.bind(controller));

router.delete('/categoria', controller.before.bind(controller), controller.remover.bind(controller));

module.exports = router;
