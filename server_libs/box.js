'use strict';

const Box = require('box-node-sdk');
const conf = require('./conf/conf.json');

console.log(conf);
const box = new Box({
  clientID: conf.client_id,
  clientSecret: conf.client_secret
})

console.log(box.getBasicClient);
console.log(box.getTokensAuthorizationCodeGrant);
console.log(box.getTokens);


box.getTokensAuthorizationCodeGrant("E8Q4Bpv4tWZtnSyfuT7dEbAIOi65ROvE", null, (err, res) => {
  console.log( res);
})
