// TODO: Move these values into .env
const api_key = 'f404e6957acba7811ed9226324134cfb-49a2671e-d19101fe';
const domain = 'sandboxe68219f726034186a6ff2f5cbe3fdc95.mailgun.org';

const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
const MailComposer = require('nodemailer/lib/mail-composer');

// TODO: Refactor these functions to be more DRY
function sendNewPollEmail(email, encryptedId, publicId) {
  let data = {
    from: 'Choosy <umair.abdulq@gmail.com>',
    to: `${email}`,
    subject: 'New Choosy Poll!',
    html: `
      <h1>Congratulations! Your new Choosy poll has been created!</h1>
      <p><a href="https://chooosy.herokuapp.com/result/${encryptedId}">Click here</a> to track your poll results <b>(keep this link secret!)</b>.</p>
      <p><a href="https://chooosy.herokuapp.com/poll/${publicId}">Share this link</a> to ask your friends, family, and colleagues to help you be Choosy.</p>
      `
  };
  let mail = new MailComposer(data);

  mail.compile().build((err, message) => {
    var dataToSend = {
      to: `${email}`,
      message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
      if (sendError) {
        console.log(sendError);
        return;
      }
    });
  });
}

function sendNewVoteEmail(email, encryptedId) {
  let data = {
    from: 'Choosy <umair.abdulq@gmail.com>',
    to: `${email}`,
    subject: 'Choosy - New Vote!',
    html: `
      <h1>You have received a new vote on your Choosy poll!</h1>
      <p><a href="https://chooosy.herokuapp.com/result/${encryptedId}">Click here</a> to see the latest poll results.</p>
      `
  };
  let mail = new MailComposer(data);

  mail.compile().build((err, message) => {
    const dataToSend = {
      to: email,
      message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
      if (sendError) {
        console.log(sendError);
        return;
      }
    });
  });
}

module.exports = { sendNewVoteEmail, sendNewPollEmail };
