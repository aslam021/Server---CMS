const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

router.route('/users')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
  
  const query = `SELECT temp.id, temp.first_name, temp.last_name, temp.email, temp.password, temp.country_code, roles.name AS user_role FROM 
  (SELECT users.id, users.first_name, users.last_name, users.email, users.password, users.country_code, role_user.role_id FROM users INNER JOIN role_user ON users.id = role_user.user_id) AS temp 
  INNER JOIN roles ON temp.role_id = roles.id ORDER BY (id) DESC`;

  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

});

router.route('/:tableName')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
  
  db.read("SELECT * FROM " + req.params.tableName , req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

});

module.exports = router;

// author 
// adalberto09@example.net
// $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

// admin
// hschultz@example.org
// $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

// reviewer
// bayer.jerald@example.org
// $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi