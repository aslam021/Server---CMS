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
    //normal users can get there data only
    let userId= req.user.id;
    if (authenticate.isAdmin && req.body.userId){
        userId = req.body.userId;
    }
    
    //TODO query update
    const query = `SELECT * FROM WHERE id='${userId}'`;
    
    db.read(query, req, res, (country)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, countryData: country, status: 'country data'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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


router.route('/role')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //admins can get any users data if they send required userId in the body
    //normal users can get there data only
    let userId= req.user.id;
    if (authenticate.isAdmin && req.body.userId){
        userId = req.body.userId;
    }
    
    //TODO query update
    const query = `SELECT * FROM usr roles WHERE id='${userId}'`;
    
    db.read(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, userRoleData: role, status: 'user role'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //TODO query update
    const query = `INSERT INTO role_user(user_id, role_id)
    VALUES(${req.user.id}, 1)`;
    
    db.create(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, userRoleData: role, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const roleUser = {
        userId: req.body.userId,
        roleId: req.body.roleId
    };
    const query = `UPDATE role_user SET role_id=${roleUser.roleId} 
    WHERE user_id='${roleUser.roleId}'`;
    
    db.update(query, req, res, (role)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, userRoleData: role, status: `${roleUser.userId} updated`});
    });
})
.delete(cors.corsWithOptions, (req, res, next) => {
    //TODO consider how to delete a role_id
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, userRoleData: null, status: 'cannot delete a user role'});
});


module.exports = router;