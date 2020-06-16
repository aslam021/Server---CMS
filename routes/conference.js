const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

router.use(bodyParser.json());


router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {

    //TODO update this such that all records of this admin can be retrieved
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, conferenceData: null, status: 'to retrieve use conference/confId end point'});

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {

    const conference = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        venue: req.body.venue,
        total_seats: req.body.total_seats,
        available_seats: req.body.available_seats
    }

    const query = "INSERT INTO conferences(title, description, date, venue, total_seats, available_seats) VALUES("
     + conference.title + ", " + conference.description + ", " + conference.date + ", " + 
     conference.venue + ", " + conference.total_seats + ", " + conference.available_seats + ")";  

    db.create(query, req, res, result=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, conferenceData: result, status: 'Upload success'});
    })

})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {

    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, conferenceData: null, status: 'to update use conference/confId end point'});

})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {

    //TODO update this such that all records of this admin can be deleted at once
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, conferenceData: null, status: 'to delete use conference/confId end point'});
});


router.route('/:confId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next) => {

    const conferenceId = req.params.confId;
    const query = "SELECT * FROM conferences WHERE id = '" + conferenceId + "' LIMIT 1";

    db.read(query, req, res, (data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, conferenceData: data[0], status: 'Your conference details are successfully obtained'});
    });

})
.post(cors.corsWithOptions, (req, res) => {

    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, conferenceData: null, status: 'post operation not supported here'});

})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {

    //TODO update query2
    const conferenceId = req.params.confId;
    const query1 = "SELECT * FROM conferences WHERE id = '" + conferenceId + "' LIMIT 1";
    const query2 = "UPDATE conferences SET fld1=vl1, fld2=val2 WHERE id = '" + conferenceId + "' LIMIT 1";

    db.read(query1, req, res, (data) => {
        //proceed to update
        db.update(query2, req, res, result=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, result: result, status: `Conference ${conferenceId} is successfully updated`});
        });

    }, ()=>{
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: "There is no such record to update"});
    });

})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {

    const conferenceId = req.params.confId;
    const query1 = "SELECT * FROM conferences WHERE id = '" + conferenceId + "' LIMIT 1";
    const query2 = "DELETE FROM conferences WHERE id = '" + conferenceId + "' LIMIT 1";

    db.read(query1, req, res, (data) => {
        //proceed to delete
        db.delete(query2, req, res, result=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, result: result, status: `Conference ${conferenceId} is successfully deleted`});
        });
    }, ()=>{
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: "There is no such record to delete"});
    });
});

module.exports = router;