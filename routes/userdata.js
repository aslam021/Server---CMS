const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

router.use(bodyParser.json());


router.route('/country')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //admins can get any users data if they send required userId in the body
    //normal users can get only there data
    let userId= req.user.id;
    if (authenticate.isAdmin && req.body.userId){
        userId = req.body.userId;
    }
    
    const query = `SELECT * FROM countries WHERE code = 
    (SELECT country_code FROM users WHERE id='${userId}' LIMIT 1) LIMIT 1`;
    
    db.read(query, req, res, (country)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, countryData: country, status: 'country data'});
    });
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "use alldata/countries end point to add a new country"});
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "use alldata/countries end point to update a country detail"});
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, countryData: null, status: 'cannot delete a country data'});
});


router.route('/roles')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //admins can get any users data if they send required userId in the body
    //normal users can get only there data
    let userId= req.user.id;
    if (authenticate.isAdmin && req.body.userId){
        userId = req.body.userId;
    }
    
    const query = `SELECT * FROM roles WHERE id = 
    (SELECT role_id FROM role_user WHERE id='${userId}' LIMIT 1) LIMIT 1`;
    
    db.read(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, userRoleData: role, status: 'user role'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const query = `INSERT INTO role_user(user_id, role_id)
    VALUES(${req.user.id}, (SELECT id FROM roles WHERE name='Author' LIMIT 1))`;
    
    db.create(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, role: role, status: 'role added'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const roleUser = {
        userId: req.body.userId,
        role: req.body.role
    };
    
    const query = `UPDATE role_user SET role_id=(SELECT id FROM roles WHERE name='${roleUser.role}' LIMIT 1) 
    WHERE user_id='${roleUser.roleId}'`;
    
    db.update(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, userRoleData: role, status: `${roleUser.userId} updated`});
    });
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, userRoleData: null, status: 'cannot delete a user role'});
});


module.exports = router;