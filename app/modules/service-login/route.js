
const express = require('express');

const router = express.Router();
const passport = require('passport');
const oauth2 = require('../../config/strategy/auth/oauth2');

// curl -X 'GET' localhost:3000/categoria-dashboard-backend/categorias
// server.get(`${info.base}/login`, controller.before.bind(controller), controller.carregar.bind(controller));
const opts = { successRedirect: '/', failureRedirect: '/login' };

router.post('/login', oauth2.token);



router.get('/auth/google', passport.authorize('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/login/callback',
  passport.authenticate('google', { failureRedirect: '/falhagoogle', successRedirect: '/profile' }), (req, res) => {
    //res.redirect('/profile');
  });


router.get(
  '/profile', (req, res, next) => {
    res.send({ teste: 'teste' });
  },
);

module.exports = router;
