// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-passport
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('dotenv').config()

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash = require('express-flash');

// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

// -- Add your pre-processing middleware here --

// Setup the view engine (jade)
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// boot scripts mount components like REST API
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

/* ####################################################################################################### */
var utils = require('../node_modules/loopback-component-passport/lib/models/utils');

var messageProvider = async function (phone, token) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  let result = await client.messages
    .create({
      body: 'This is your OTP for login: ' + token,
      from: process.env.TWILIO_MOBILE_NUMBER,
      to: phone // phone number actually consists of country code and 10 digit mobile number
    })

    return result;
}

var customProfileToUser = function (provider, profile, options) {
  var profileEmail = profile.emails && profile.emails[0] && profile.emails[0].value;
  var username = profile.username;
  var password = utils.generateKey('password');
  var phone = profile.phone
  var userObj = {
    password: password,
    username: username,
    phone: phone
  };
  if (profileEmail) {
    userObj.email = profileEmail;
  }
  return userObj;
}

/* ############################################################################################# */
for (var s in config) {
  var c = config[s];
  // if (c.module === 'passport-otp') {
  //   c.messageProvider = messageProvider;
  // }
  c.profileToUser = customProfileToUser;
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get('/', function (req, res, next) {
  res.render('pages/index', {
    user:
      req.user,
    url: req.url,
  });
});

app.get('/auth/account', ensureLoggedIn('/login'), function (req, res, next) {
  res.render('pages/loginProfiles', {
    user: req.user,
    url: req.url,
  });
});

app.get('/local', function (req, res, next) {
  res.render('pages/local', {
    user: req.user,
    url: req.url,
  });
});

app.get('/otp', function (req, res, next) {
  res.render('pages/otp', {
    user: req.user,
    url: req.url,
  });
});

var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret({ length: 20 });
var token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});
app.post('/tempo/otp', function (req, res, next) {

  const accountSid = 'AC699135a39630eef9c93531ece5a14239';
  const authToken = '3f44a4c50b511c1be8f15c0e799b92a8';
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: 'This is your OTP for login: ' + token,
      from: '+12012926522',
      statusCallback: 'http://postb.in/1234abcd',
      to: req.body.countryCode + req.body.mobile
    })
    .then(message => console.log(message.sid));

  // res.send({
  //   'Country Code': req.body.countryCode,
  //   'Mobile Number': req.body.mobile
  // });

  res.render('pages/verify');
});

app.post('/otp/verify', function (req, res, next) {
  var tokenValidates = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: req.body.otp,
    window: 6
  });

  if (tokenValidates) {
    res.send('successfully verified');
  }

});


app.get('/ldap', function (req, res, next) {
  res.render('pages/ldap', {
    user: req.user,
    url: req.url,
  });
});

app.get('/signup', function (req, res, next) {
  res.render('pages/signup', {
    user: req.user,
    url: req.url,
  });
});

app.post('/signup', function (req, res, next) {
  var User = app.models.user;

  var newUser = {};
  newUser.email = req.body.email.toLowerCase();
  newUser.username = req.body.username.trim();
  newUser.password = req.body.password;
  newUser.emailVerified = true;
  newUser.bio = req.body.Bio;

  User.create(newUser, function (err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    } else {
      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, function (err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/account');
      });
    }
  });
});

app.get('/login', function (req, res, next) {
  res.render('pages/login', {
    user: req.user,
    url: req.url,
  });
});

app.get('/auth/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
