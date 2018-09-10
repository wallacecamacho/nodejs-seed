const passport = require('passport');
const Basic = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const libs = `${process.cwd()}/app/modules/`;
const logger = require('../../../config/log')({ module: 'Auth Service' });
const config = require('../../../config');
const clientsApp = require('./clients');
const Client = require('../../../modules/service-token/model/client');
const User = require('../../../modules/service-usuario/model/usuario-model');
const UserSchema = require('../../../modules/service-usuario/validate/usuario-schema-validate');
const usuarioService = require('../../../modules/service-usuario/service/usuario-service');

const AccessToken = require('../../../modules/service-token/model/accessToken');

// 2 Client Password strategies - 1st is required, 2nd is optional
// https://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1

// Client Password - HTTP Basic authentication
passport.use(new Basic(((username, password, done) => {
  Client.findOne({ clientId: username }, (err, client) => {
    if (err) {
      return done(err);
    }

    if (!client) {
      return done(null, false);
    }

    if (client.clientSecret !== password) {
      return done(null, false);
    }

    return done(null, client);
  });
})));

// Bearer Token strategy
// https://tools.ietf.org/html/rfc6750

passport.use(new BearerStrategy(((accessToken, done) => {
  AccessToken.findOne({ token: accessToken }, (error, token) => {
    if (error) {
      return done(error);
    }

    if (!token) {
      return done(null, false);
    }

    if (Math.round((Date.now() - token.created) / 1000) > config.security.tokenLife) {
      AccessToken.remove({ token: accessToken }, (err) => {
        if (err) {
          return done(err);
        }
        return true;
      });

      return done(null, false, { message: 'Token expired' });
    }

    User.findById(token.userId, (erro, user) => {
      if (erro) {
        return done(erro);
      }

      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }

      const info = { scope: '*' };
      return done(null, user, info);
    });

    return null;
  });
})));

passport.use(new ClientPasswordStrategy(((clientId, clientSecret, done) => {
  Client.findOne({ clientId }, (err, client) => {
    if (err) {
      return done(err);
    }

    if (!client) {
      return done(null, false);
    }

    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }

    return done(null, client);
  });
})));

const fbStrategy = clientsApp.facebookAuth;
fbStrategy.passReqToCallback = true;
passport.use(new FacebookStrategy(fbStrategy, ((req, token, refreshToken, profile, done) => {
  // asynchronous
  process.nextTick(() => {
    // check if the user is already logged in
    if (!req.user) {
      User.findOne({ 'facebook.id': profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          const puser = new User(user);
          // if there is a user id already but no token (user was linked at one point and then removed)
          if (!user.facebook.token) {
            puser.facebook.token = token;
            puser.nome = profile.name.givenName;
            puser.sobreNome = profile.name.familyName;
            puser.email = (profile.emails[0].value || '').toLowerCase();

            user.save((error) => {
              if (error) {
                return done(err);
              }
              return done(null, user);
            });
          }
          return done(null, user); // user found, return that user
        }
        // if there is no user, create them
        const newUser = new User(user);
        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

        this.usuarioService.cadastrar(user)
          .then((result) => {
            if (result) {
              return done(err);
            }
            return done(null, newUser);
          }).catch(erro => done(erro));

        /*
        newUser.save((err) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
        */
      });
    } else {
      // user already exists and is logged in, we have to link accounts
      const user = req.user; // pull the user out of the session

      user.facebook.id = profile.id;
      user.facebook.token = token;
      user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
      user.facebook.email = (profile.emails[0].value || '').toLowerCase();

      user.save((err) => {
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    }
  });
})));


const googleStrategy = clientsApp.googleAuth;
googleStrategy.passReqToCallback = true;

/*
passport.use(new GoogleStrategy(googleStrategy,
function(req, accessToken, refreshToken, profile, cb) {
  User.findOne({ 'google.id': profile.id }, (err, user) => {
    return cb(err, null);
  });
}
));
*/

passport.use(new GoogleStrategy(googleStrategy, ((req, token, refreshToken, profile, done) => {
  // asynchronous
  process.nextTick(() => {
    // check if the user is already logged in
    if (!req.user) {
      User.findOne({ email: (profile.emails[0].value || '').toLowerCase() }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          // if there is a user id already but no token
          // (user was linked at one point and then removed)
          //  if (!user.google.token) {
          UserSchema._id = user.id;
          UserSchema.nome = profile.name.givenName;
          UserSchema.sobreNome = profile.name.familyName;
          UserSchema.provider = profile.provider;
          UserSchema.google = {};
          UserSchema.google.id = profile.id;
          UserSchema.google.token = token;
          UserSchema.google.email = (profile.emails[0].value || '').toLowerCase();

          usuarioService.atualizar(UserSchema).then((result) => {
            if (result) {
              logger.accessLog.info('atualizarUsuario::Objeto atualizado documento já existe na base de dados', result._id);
            }
          });
          return done(null, user);
          // }
        }

        UserSchema.nome = profile.name.givenName;
        UserSchema.sobreNome = profile.name.familyName;
        UserSchema.email = (profile.emails[0].value || '').toLowerCase();
        UserSchema.provider = profile.provider;
        UserSchema.google = {};
        UserSchema.google.id = profile.id;
        UserSchema.google.token = token;
        UserSchema.password = profile.id;

        usuarioService.cadastrar(UserSchema).then((result) => {
          if (result) {
            return done(null, result);
          }
          return done(false);
        }).catch(erro => done(erro));

        return done(null, user);
      });
    } else {
      UserSchema.nome = profile.name.givenName;
      UserSchema.sobreNome = profile.name.familyName;
      UserSchema.email = (profile.emails[0].value || '').toLowerCase();
      UserSchema.provider = profile.provider;
      UserSchema.google = {};
      UserSchema.google.id = profile.id;
      UserSchema.google.token = token;
      UserSchema.password = profile.id;

      usuarioService.cadastrar(UserSchema).then((result) => {
        if (result) {
          return done(null, result);
        }
        return done(false);
      }).catch(erro => done(erro));
    }
  });
})));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  });
});
