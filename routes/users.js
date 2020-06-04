var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var User = require('../models/user');
var authenticate = require('../authenticate');

router.use(bodyParser.json());


router.post('/signup', (req, res, next) => {
  
  const userData = {
    id: 1,
    name: req.body.name,
    email: req.body.email,
    hashedPassword: req.body.password,
  }

  User.findOne({
    where: {
      email: userData.email
    }
  })
  .then(user=>{
    if (!user) {

      User.create(userData)
      .then(user => {

        let token = authenticate.getToken({_email: user.email});

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully registerd!'});
      })
      .catch(err => {
        res.send('error: ' + err);
      })

    } else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, token: null, status: userData.email + ' has already registerd!'});
    }
  })
  .catch(err => {
    res.send('error: ' + err);
  })
});


router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (user) {
      
      if (req.body.password === user.hashedPassword ) {
  
        let token = authenticate.getToken({_email: user.email});
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
      }

    } else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, token: null, status: 'You are not registerd!'});
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