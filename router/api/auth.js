const express = require('express');
const router = express.Router();
const keys = require('../../config/keys');
const memberlist = require('../../memberlist.json');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = keys.clientID;
const client = new OAuth2Client(CLIENT_ID);

router.get('/', (req, res) => {
  let token = req.cookies['session-token'];
  if (token) {
    res.redirect('/profile');
  } else {
    res.render('index');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const domain = payload['hd'];
    const email = payload.email;

    if (!memberlist.hasOwnProperty(email)) {
      // Object lookup O(1) than array O(n)
      throw 'User is not a Rens member';
    }

    // if (domain != 'rensoriginal.com') {
    //   throw 'User is not a Rens member';
    // }
    // List of member is provided, not email by domain
  }

  verify()
    .then(() => {
      res.cookie('session-token', token);
      res.send('success');
    })
    .catch((err) => res.status(401).send(err));
});

router.get('/logout', (req, res) => {
  res.clearCookie('session-token');
  res.redirect('/');
});

module.exports = router;
