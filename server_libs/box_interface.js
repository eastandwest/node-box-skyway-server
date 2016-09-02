'use strict';

const Box = require('box-node-sdk');
const conf = require('../conf/conf.json');

const log4js = require('log4js');
const logger = log4js.getLogger("box_interface")

class BoxInterface {
  constructor() {
    this._client_id     = conf.box.client_id;
    this._auth_endpoint = conf.box.auth_endpoint;

    logger.debug("BoxInterface initiated");
    logger.debug("  client id : %s",     this._client_id);
    logger.debug("  auth endpoint : %s", this._auth_endpoint);

    this.box = new Box({
      clientID:     this._client_id,
      clientSecret: conf.box.client_secret
    })
  }

  get client_id() {
    return this._client_id;
  }

  get auth_endpoint() {
    return this._auth_endpoint;
  }
}

// box.getTokensAuthorizationCodeGrant("E8Q4Bpv4tWZtnSyfuT7dEbAIOi65ROvE", null, (err, res) => {
//   console.log( res);

// })


module.exports = BoxInterface;
