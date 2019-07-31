require('dotenv').config();

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function (req, res, next) {
  res.send('hello');
});

/**
 * Valida en token para devolver el challenge
 */
router.get('/webhook', function (req, res, next) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // console.log({ mode, token, challenge });

  if (!mode || !token || !challenge) {
    return res.sendStatus(400);
  }

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

router.post('/webhook', function (req, res, next) {
  const body = req.body;

  if (!body.object) {
    return res.sendStatus(400);
  }

  if (body.object === 'page') {

    if (body.entry) {
      for (let entry of body.entry) {
        const webhookEvent = entry.messaging[0];
        console.log({ webhookEvent });
      }
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  res.sendStatus(404);
});

module.exports = router;
