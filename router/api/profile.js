const express = require('express');
const router = express.Router();
const keys = require('../../config/keys');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = keys.clientID;
const client = new OAuth2Client(CLIENT_ID);

router.get('/', checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render('profile', { user });
});

function checkAuthenticated(req, res, next) {
  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
  }

  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch((err) => res.redirect('/'));
}

module.exports = router;
