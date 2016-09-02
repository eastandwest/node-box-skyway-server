"use strict";

const express = require('express');
const log4js = require('log4js');
const fs = require('fs');
const https = require('https');

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
app.set('view engine', 'ejs');


//////////////////////////////////////////////////////////////
// routing section
//////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  const opts = {
    'title': 'box-skyway: login page'
  }
  res.render('index', opts);
});

app.get('/access_token', (req, res) => {
  const opts = {
    'title': 'box-skyway: access-token'
  }
  res.render('access_token', opts);
});

app.get('/fileviewer', (req, res) => {
  const opts = {
    'title': 'box-skyway: fileviewer'
  }
  res.render('fileviewer', opts);
});

//////////////////////////////////////////////////////////////
// start server process
//////////////////////////////////////////////////////////////
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  logger.info('Example app listening on port %d!', PORT);
});
