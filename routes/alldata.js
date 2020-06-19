const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

router.route('/countries')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM countries`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
    const country = {
        code: req.body.code,
        name: req.body.name,
        flag: req.body.flag
    };
    const query = `INSERT INTO countries(code, name, flag) 
    VALUES(${country.code}, ${country.name}, ${country.flag})`;
    
    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, countryData: result, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const country = {
        code: req.body.code,
        name: req.body.name,
        flag: req.body.flag
    };
    const query = `UPDATE countries SET name=${country.code}, flag=${country.flag} 
    WHERE code='${country.code}'`;
    
    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, countryData: result, status: `${country.flag} updated`});
    });
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, countryData: null, status: 'cannot delete a country data'});
});


router.route('/roles')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM roles`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot add a new user role'});
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot update a user role'});
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot delete a user role'});
});


module.exports = router;