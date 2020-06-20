const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());


router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
    const query = `SELECT * FROM submissions`;

    db.read(query, req, res, (submissions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({submissions});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    const submission = {
        subject_id: req.body.subject_id,
        title: req.body.title,
        co_authors: req.body.co_authors,
        status: `pending`,
        file: req.body.path
    };

    const query = `INSERT INTO submissions(user_id, subject_id, title, co_authors, status, file)
    VALUES(${req.user.id}, ${submission.subject_id}, ${submission.title}, ${submission.co_authors}, ${submission.status}, ${submission.file})`;

    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, submissionData: result, status: 'inserted'});
    })
})
.put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, submissionData: null, status: 'put operation is not supported here'});
})
.delete(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, submissionData: null, status: 'cannot delete all submissions'});
});


router.route('/:submissionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
    const query = `SELECT * FROM submissions WHERE id='${req.params.submissionId}'`;

    db.read(query, req, res, (submission) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({submission});
    });
})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, submissionData: null, status: 'post operation is not supported here'});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    const submission = {
        subject_id: req.body.subject_id,
        title: req.body.title,
        co_authors: req.body.co_authors,
        file: req.body.path
    };
    const query = `UPDATE submissions SET subject_id=${submission.subject_id}, 
    title=${submission.title}, co_authors=${submission.co_authors}, file=${submission.filename}
    WHERE id=${req.params.submissionId} AND user_id=${req.user.id}`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, submissionData: result, status: 'submission updated'});
    }, (error)=>{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, submissionData: error, 
            status: `You may not the author of this submission or there are no submission in the id ${req.params.submissionId}`});
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    let query = `DELETE FROM submissions WHERE id=${req.params.submissionId} AND user_id=${req.user.id}`

    //admin can delete any submission
    if(authenticate.isAdmin){
        query = `DELETE FROM submissions WHERE id=${req.params.submissionId}`
    }

    db.delete(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, submissionData: result, status: 'delete request success'});
    })
});

module.exports = router;