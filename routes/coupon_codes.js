const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

router.use(bodyParser.json());


router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const conferenceId = req.body.conferenceId;
    const query = `SELECT * FROM coupen_codes WHERE conference_id = '${conferenceId}'`;

    db.read(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, coupenData: result, status: 'coupen codes'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const coupen = {
        conferenceId: req.body.conferenceId,
        vendor: req.body.vendor,
        coupen_code: req.body.coupen_code,
        discount: req.body.discount
    };
    const query = `INSERT INTO coupen_codes(conference_id, vendor, coupon_code, discount)
    VALUES(${coupen.conferenceId}, ${coupen.vendor}, ${coupen.coupen_code}, ${coupen.discount})`;

    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, coupenData: result, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const coupen = {
        conferenceId: req.body.conferenceId,
        vendor: req.body.vendor,
        coupen_code: req.body.coupen_code,
        discount: req.body.discount
    };
    const query = `UPDATE coupen_codes SET vendor=${coupen.vendor}, discount=${coupen.discount} 
    WHERE conference_id = '${coupen.conferenceId}' AND coupen_code='${coupen.coupen_code}'`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, coupenData: result, status: `${coupen.coupen_code} updated`});
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const coupen = {
        conferenceId: req.body.conferenceId,
        coupen_code: req.body.coupen_code
    };
    const query = `DELETE FROM coupen_codes 
    WHERE conference_id = '${coupen.conferenceId}' AND coupen_code='${coupen.coupen_code}' LIMIT 1`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, coupenData: result, status: `${coupen.coupen_code} deleted`});
    });
});

module.exports = router;