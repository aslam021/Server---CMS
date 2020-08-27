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
    const query = `SELECT * FROM tickets WHERE conference_id = '${conferenceId}' AND user_id='${req.user.id}'`;

    db.read(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, ticketData: result, status: 'tickets'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const ticket = {
        conferenceId: req.body.conferenceId,
        coupon_code: req.body.coupon_code,
        type: req.body.type,
        price: req.body.price
    };

    const query1 = 'START TRANSACTION';
    const query2 = `INSERT INTO tickets(user_id, conference_id, coupon_code, type, price)
    VALUES(${req.user.id}, ${ticket.conferenceId}, ${ticket.coupon_code}, ${ticket.type}, ${ticket.price})`;
    const query3 = 'COMMIT';

    db.create(query1, req, res, ()=>{
        db.create(query2, req, res, ()=>{
            db.create(query3, req, res, ()=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'ticket added'});
            })
        })
    });
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, ticketData: null, status: 'use tickets/<ticketId>'});
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, ticketData: null, status: 'use tickets/<ticketId>'});
});


router.route('/:ticketId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, ticketData: null, status: 'use /tickets'});
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, ticketData: null, status: 'use /tickets'});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const ticket = {
        conferenceId: req.body.conferenceId,
        coupon_code: req.body.coupon_code,
        type: req.body.type,
        price: req.body.price
    };

    const query = `UPDATE tickets SET coupon_code=${ticket.coupon_code}, type=${ticket.type}, price=${ticket.price} 
    WHERE id = '${req.params.ticketId}' AND conference_id = '${ticket.conferenceId}' AND user_id='${req.user.id}' LIMIT 1`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, ticketData: result, status: 'ticket updated'});
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const conferenceId = req.body.conferenceId;
    const query = `DELETE FROM tickets 
    WHERE id = '${req.params.ticketId}' AND conference_id = '${conferenceId}' AND user_id='${req.user.id}' LIMIT 1`;

    db.delete(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, ticketData: result, status: 'ticket deleted'});
    });
});

module.exports = router;