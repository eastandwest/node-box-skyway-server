"use strict";

const helper = require('sendgrid').mail;

const conf = require('../conf/conf.json');

const api_key = conf.sendgrid.api_key;
const from_email = conf.sendgrid.from_email;

const sg = require('sendgrid')(api_key);

class MySendGrid {
  send(to_email, subject, content) {
    const _from_email = new helper.Email(from_email);
    const _to_email = new helper.Email(to_email);
    const _subject = subject;
    const _content = new helper.Content('text/html', content);
    const mail = new helper.Mail(_from_email, _subject, _to_email, _content);

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  }
}


// const mySendGrid = new MySendGrid();
// mySendGrid.send("kensaku.komatsu@gmail.com", "test mail", "hello insideshare!!");

module.exports = MySendGrid;
