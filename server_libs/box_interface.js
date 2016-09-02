'use strict';

const Box = require('box-node-sdk');
const conf = require('../conf/conf.json');

const log4js = require('log4js');
const logger = log4js.getLogger("box_interface")

class BoxInterface {
  constructor() {
    this._client_id     = conf.box.client_id;
    this._auth_endpoint = conf.box.auth_endpoint;
    this._clients        = {};

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

  createClient(client_id, code, callback) {
    this.box.getTokensAuthorizationCodeGrant(code, null, (err, tokenInfo) => {
      if ( tokenInfo ) {
        const client = this.box.getPersistentClient(tokenInfo);
        this._clients[client_id] = client;
        callback(null, "succeed");
      } else {
        const err_mesg = "can't create token : " + err.toString();
        logger.warn(err_mesg)
        callback(err_mesg, null);
      }
    });
  }

  getBoxClient(client_id) {
    return this._clients[client_id];
  }

  getUserInfo(client_id, callback) {
    const box_client = this.getBoxClient(client_id);
    if(box_client) {
      box_client.users.get(
        box_client.CURRENT_USER_ID,
        null,
        (err, user_info) => {
          callback(err, user_info);
        }
      );
    } else {
      callback("can't find box client for " + client_id, null);
    }
  }
}

// box.getTokensAuthorizationCodeGrant("E8Q4Bpv4tWZtnSyfuT7dEbAIOi65ROvE", null, (err, res) => {
//   console.log( res);

// })


module.exports = BoxInterface;
