"use strict";

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
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

const dataStore = {}; // fixme : change it as persistent db
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
app.use(bodyParser.json())
// Gapp.use(bodyParser.urlencoded({ extended: false }))

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

  const prev = req.query.prev;
  const state = req.query.state;

  if( req.query.code ) {
    const code = req.query.code;
    const url = !!state ? state : '/folder/0';

    box.createClient(sess.id, code, (err, data) => {
      if ( data ) {
        res.redirect(url);
      } else {
        res.redirect("/");
      }
    })
  } else {
    const opts = {
      'title': 'box-skyway: login page',
      'auth_endpoint': box.auth_endpoint,
      'client_id': box.client_id,
      'state': prev
    };
    res.render('index', opts);
  }
});

app.get('/folder/:folder_id', (req, res) => {
  const folder_id = req.params.folder_id;
  const sess = req.session;


  box.getUserInfo(sess.id, (err, user_data) => {
    if( user_data ) {

      const opts = {
        'title': 'box-skyway: main',
        'user_data': user_data,
        'folder_id': folder_id
      }
      res.render('folder', opts);
    }  else {
      logger.warn("/folder/:id --- cannot get user info for %s", sess.id);
      res.redirect("/?prev=/folder/"+folder_id);
    }
  });
});

app.get('/file/:file_id', (req, res) => {
  const sess = req.session;
  const file_id = req.params.file_id;

  box.getUserInfo(sess.id, (err, user_data) => {
    if(user_data && !err) {
      box.getFileInfo(sess.id, file_id, (err, file_data) => {
        if(file_data && !err) {
          const opts = {
            'title': 'box-skyway: file',
            'user_data': user_data,
            'file_data': file_data
          }
          res.render('file', opts);
        } else {
          res.redirect('/?prev=/file/'+file_id);
        }
      })
    } else {
      res.redirect('/?prev=/file/'+file_id);
    }
  })
})

app.get('/shared/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const shared_data = dataStore[req.params.user_id];

  if(shared_data) {
    const opts = {
      'title': 'box-skyway: shared contents',
      'user_data': shared_data.user_data,
      'file_datas': shared_data.file_datas
    }
    res.render('shared', opts);
  } else {
    res.status(404).send("not found");
  }
});

app.get('/shared/:user_id/:file_id', (req, res) => {
  const user_id = req.params.user_id;
  const file_id = req.params.file_id;
  const shared_data = dataStore[req.params.user_id];

  if(shared_data) {
    const opts = {
      'title': 'box-skyway: shared file',
      'user_data': shared_data.user_data,
      'file_data': shared_data.file_datas[file_id],
    }
    res.render('shared-file', opts);
  } else {
    res.status(404).send("not found");
  }
});

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

app.get('/api/thumbnail/:file_id', (req, res) => {
  const file_id = req.params.file_id;
  const sess = req.session;
  const qs = req.query;

  if(!sess.id) { res.redirect('/'); }

  box.getThumbnail(sess.id, file_id, qs, (err, data) => {
    if(data && !err) {
      if(data.location) {
        res.redirect(data.location);
      } else if(data.file) {
        res.send(data.file);
      } else {
        // fixme : should be redirected to dummy contents
        res.status(404).end("");
      }
    } else {
      res.status(403).send(err);
    }
  });
})

app.post('/api/share/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const user_data = req.body.user_data || {};
  const file_data = req.body.file_data || {};
  const doShare = req.body.doShare || false;

  if(user_id === user_data.id && file_data.id) {
    // fixme: remove file_data, if expired itself.
    dataStore[user_id] = dataStore[user_id] || {};
    dataStore[user_id].user_data = user_data;
    dataStore[user_id].file_datas = dataStore[user_id].file_datas || {};
    if(doShare) {
      dataStore[user_id].file_datas[file_data.id] = doShare ? file_data : null;
    } else {
      delete dataStore[user_id].file_datas[file_data.id];
    }

    console.dir(dataStore);

    res.send("succeeded to share");
  } else {
    let mesg = (user_id !== user_data.id) ?
      "user_id does not match with sent data":
      "file id does not included";
    logger.warn(mesg);
    res.status(400).send(mesg);
  }
})

//////////////////////////////////////////////////////////////
// start server process
//////////////////////////////////////////////////////////////
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  logger.info('Example app listening on port %d!', PORT);
});
