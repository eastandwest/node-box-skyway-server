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

  createClient(box_client_id, code, callback) {
    this.box.getTokensAuthorizationCodeGrant(code, null, (err, tokenInfo) => {
      if ( tokenInfo ) {
        const client = this.box.getPersistentClient(tokenInfo);
        this._clients[box_client_id] = client;
        logger.debug("succeeded to get access_token", tokenInfo)
        callback(null, "succeed");
      } else {
        const err_mesg = "can't create token : " + err.toString();
        logger.warn(err_mesg)
        callback(err_mesg, null);
      }
    });
  }

  getBoxClient(box_client_id) {
    return this._clients[box_client_id];
  }

  getUserInfo(box_client_id, callback) {
    logger.debug("getUserInfo - %s", box_client_id);
    const box_client = this.getBoxClient(box_client_id);
    if(box_client) {
      box_client.users.get(
        box_client.CURRENT_USER_ID,
        null,
        callback
      );
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }

  getFileInfo(box_client_id, file_id, callback) {
    const box_client = this.getBoxClient(box_client_id);

    if(box_client) {
      box_client.files.get(
        file_id.toString(),
        null,
        callback
      );
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }

  getExpiringEmbedLink(box_client_id, file_id, callback) {
    const box_client = this.getBoxClient(box_client_id);

    if(box_client) {
      box_client.files.get(
        file_id.toString(),
        {"fields": "expiring_embed_link"},
        callback
      );
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }

  getThumbnail(box_client_id, file_id, qs, callback) {
    const box_client = this.getBoxClient(box_client_id);

    if(box_client) {
      box_client.files.getThumbnail(file_id, qs, callback);
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }


  getFolderInfo(box_client_id, folder_id, callback) {
    const box_client = this.getBoxClient(box_client_id);

    if(box_client) {
      box_client.folders.getItems(
        folder_id.toString(),
        {
          fields: 'name,parent,path_collection',
          offset: 0,
          limit: 25
        },
        callback
      );
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }

  getFolderItems(box_client_id, folder_id, callback) {
    const box_client = this.getBoxClient(box_client_id);

    if(box_client) {
      box_client.folders.getItems(
        folder_id.toString(),
        {
          fields: 'name,modified_at,size,url,permissions,sync_state,path_collection',
          offset: 0,
          limit: 25
        },
        callback
      );
    } else {
      callback("can't find box client for " + box_client_id, null);
    }
  }
}

// box.getTokensAuthorizationCodeGrant("E8Q4Bpv4tWZtnSyfuT7dEbAIOi65ROvE", null, (err, res) => {
//   console.log( res);

// })


module.exports = BoxInterface;
