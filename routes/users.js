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
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    // country_code: req.body.country_code
  }
  if (userData.country_code==null) 
    userData.country_code = 'AS';
    
  const query = `SELECT * FROM users WHERE email = '${userData.email}' LIMIT 1`;

  db.read(query, req, res, (result)=>{
    
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, token: null, status: userData.email + ' has already registerd!'});
  
  }, () => {
      const query = `INSERT INTO users(first_name, last_name, email, password, country_code) 
      VALUES ('${userData.first_name}','${userData.last_name}','${userData.email}','${userData.password}','${userData.country_code}')`;
      
      db.create(query, req, res, (result)=>{
      
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
  const query = `SELECT * FROM users WHERE email = '${email}' LIMIT 1`;
  
  db.read(query , req, res, (user) => {
    console.log(user);
    if(user[0].password === password ){

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
  }, ()=>{
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, token: null, status: 'Email or password invalid!'});
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