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
        res.redirect("/folder/0")
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

app.get('/folder/:folder_id', (req, res) => {
  const folder_id = req.params.folder_id;
  const sess = req.session;


  box.getUserInfo(sess.id, (err, user_info) => {
    if( user_info ) {

      const opts = {
        'folder_id': folder_id,
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

app.get('/file/:file_id', (req, res) => {
  const sess = req.session;
  const file_id = req.params.file_id;

  box.getFileInfo(sess.id, file_id, (err, data) => {
    if(data && !err) {
      const opts = {
        'title': 'box-skyway: file',
        'file_info': data
      }
      res.render('file', opts);
    } else {
      res.redirect('/');
    }
  })
})

// apis

app.get('/api/folder_items/:folder_id', (req, res) => {
  const folder_id = req.params.folder_id;
  const sess = req.session;

  if(!sess.id) { res.redirect('/'); }

  box.getFolderItems(sess.id, folder_id, (err, data) => {
    if(data && !err) {
      res.json(data);
    } else {
      res.status(400).send(err);
    }
  })
})

app.get('/api/folder_info/:folder_id', (req, res) => {
  const folder_id = req.params.folder_id;
  const sess = req.session;

  if(!sess.id) { res.redirect('/'); }

  box.getFolderInfo(sess.id, folder_id, (err, data) => {
    if(data && !err) {
      res.json(data);
    } else {
      res.status(400).send(err);
    }
  })
})

app.get('/api/expiring_embed_link/:file_id', (req, res) => {
  const file_id = req.params.file_id;
  const sess = req.session;

  if(!sess.id) { res.redirect('/'); }

  box.getExpiringEmbedLink(sess.id, file_id, (err, data) => {
    if(data && !err) {
      res.json(data);
    } else {
      res.status(400).send(err);
    }
  })

})


//////////////////////////////////////////////////////////////
// start server process
//////////////////////////////////////////////////////////////
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  logger.info('Example app listening on port %d!', PORT);
});
