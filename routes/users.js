var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var User = require('../models/user');
var authenticate = require('../authenticate');

router.use(bodyParser.json());


router.post('/signup', (req, res, next) => {
  
  const userData = {
    username: req.body.username,
    password: req.body.password,
  }

  User.findOne({
    where: {
      username: userData.username
    }
  })
  .then(user=>{
    if (!user) {
      // bcrypt.hash(req.body.password, 10, (err, hash) => {
      //   userData.password = hash
      //   User.create(userData)
      //     .then(user => {
      //       res.json({ status: user.email + 'Registered!' })
      //     })
      //     .catch(err => {
      //       res.send('error: ' + err)
      //     })
      // })

      User.create(userData)
      .then(user => {

        let token = authenticate.getToken({_id: user.username});

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: user.username + 'Registered!', token: token});
      })
      .catch(err => {
        res.send('error: ' + err);
      })

    } else {
      res.json({ error: 'User already exists' });
    }
  })
  .catch(err => {
    res.send('error: ' + err);
  })
});


router.post('/login', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (user) {

      // TODO: replace 'req.body.password === user.password' with 'bcrypt.compareSync(req.body.password, user.password')
      if (req.body.password === user.password ) {
  
        let token = authenticate.getToken({_id: user.username});

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
      }

    } else {
      res.status(400).json({ error: 'User does not exist' })
    }
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })
});


router.get('/logout', (req, res, next)=>{
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'remove the token from local storage of the client'});
});

module.exports = router;