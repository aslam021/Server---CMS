const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

router.use(bodyParser.json());


router.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {

  const userData = {
    id: 2,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  db.read("SELECT * FROM users WHERE email = '"+ userData.email+"'", req, res, (result)=>{
    
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, token: null, status: userData.email + ' has already registerd!'});
  
  }, () => {
      
      db.create("INSERT INTO users VALUES ('"+userData.name+"','aslam','as','"+userData.email+"','a','AS','2020-06-11 09:40:37',NULL)",
      req, res, (result)=>{
      
      const token = authenticate.getToken({_email: userData.email});

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully registerd!'});
    
    });
  });
});


router.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  db.read("SELECT * FROM users WHERE email = '"+email+"' LIMIT 1" , req, res, (user) => {
    console.log(user);
    if(user.length == 0 || user[0].password === password ){

      const token = authenticate.getToken({_email: user[0].email});

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
    else{
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, token: null, status: 'Email or password invalid!'});
    }
  });
});


router.route('/logout')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next)=>{
  res.statusCode = 422;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'remove the token from local storage of the client'});
});

module.exports = router;