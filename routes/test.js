const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

router.route('/:tableName')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
  
  db.read("SELECT * FROM " + req.params.tableName , req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

});

module.exports = router;