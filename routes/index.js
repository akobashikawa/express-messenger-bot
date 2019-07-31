var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function (req, res, next) {
  res.send('hello');
});

router.get('/webhook', function (req, res, next) {
  res.send('CHALLENGE_ACCEPTED');
});

module.exports = router;
