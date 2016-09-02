"use strict";

const express = require('express');
const session = require('express-session');
const log4js = require('log4js');
const fs = require('fs');
const https = require('https');

const BoxInterface = require('./server_libs/box_interface');

const conf = require("./conf/conf.json");

const app = express();
const logger = log4js.getLogger("app");


//////////////////////////////////////////////////////////////
// network setting section
//////////////////////////////////////////////////////////////
const key  = fs.readFileSync(__dirname + "/keys/server.key");
const cert = fs.readFileSync(__dirname + "/keys/server.crt");
const credentials = {'key': key, 'cert': cert};
const PORT = process.env.PORT || 3000;

//////////////////////////////////////////////////////////////
// server setting section
//////////////////////////////////////////////////////////////
const box = new BoxInterface();
app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use(express.static('public'));
app.use(session({
  "secret" : conf.app.session_secret,
  "resave" : false,
  "saveUninitialized": true,
  "cookie": {
    "maxAge": 86400,
    "secure": true
  }
}))

//////////////////////////////////////////////////////////////
// routing section
//////////////////////////////////////////////////////////////


// pages

app.get('/', (req, res) => {
  const sess = req.session;

  const opts = {
    'title': 'box-skyway: login page',
    'auth_endpoint': box.auth_endpoint,
    'client_id': box.client_id
  }

  if(req.query.code) {
    const code = req.query.code;
    box.createClient(sess.id, code, (err, data) => {
      if ( data ) {
        res.redirect("/main")
      } else {
        res.redirect("/");
      }
    })
  } else {
    const opts = {
      'title': 'box-skyway: login page',
      'auth_endpoint': box.auth_endpoint,
      'client_id': box.client_id
    };
    res.render('index', opts);
  }
});

app.get('/main', (req, res) => {
  const sess = req.session;

  box.getUserInfo(sess.id, (err, user_info) => {
    if( user_info ) {
      logger.debug(user_info);

      const opts = {
        'title': 'box-skyway: main',
        'user_info': user_info
      }
      res.render('main', opts);
    }  else {
      logger.warn("cannot get user info for %s", sess.id);
      res.redirect("/");
    }
  });
});

// apis

//////////////////////////////////////////////////////////////
// start server process
//////////////////////////////////////////////////////////////
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  logger.info('Example app listening on port %d!', PORT);
});
