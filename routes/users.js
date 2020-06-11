const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());


router.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
  const userData = {
    id: 2,
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


router.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (user && req.body.password === user.hashedPassword) {
      let token = authenticate.getToken({_email: user.email});
        
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    } 
    else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, token: null, status: 'Email or password invalid!'});
    }
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })
});


router.route('/logout')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next)=>{
  res.statusCode = 422;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'remove the token from local storage of the client'});
});

module.exports = router;