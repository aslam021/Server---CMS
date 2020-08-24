const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

router.use(bodyParser.json());


router.route('/:subId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const submissionId = req.params.subId;
    const query = `SELECT * FROM review_scores WHERE submission_id = '${submissionId}'`;

    db.read(query, req, res, (result)=>{

        let rating = {
            completeness: 0,
            subject_knowledge: 0,
            comments: []
        }

        result.map(rate => {
            rating.completeness = rating.completeness + rate.completeness;
            rating.subject_knowledge = rating.subject_knowledge + rate.subject_knowledge;
            rating.comments.push(rate.comments);
        })

        rating.completeness = rating.completeness/result.length;
        rating.subject_knowledge = rating.subject_knowledge/result.length;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, rating: rating, status: 'coupen codes'});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const submissionId = req.params.subId;
    const rating = {
        completeness: req.body.completeness,
        subject_knowledge: req.body.subject_knowledge,
        comments: req.body.comments
    };

    const query = `INSERT INTO review_scores(submission_id, completeness, subject_knowledgem, comments)
    VALUES(${submissionId}, '${rating.completeness}', '${rating.subject_knowledge}', ${rating.comments})`;

    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, result: result, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const submissionId = req.params.subId;
    const rating = {
        id: req.body.ratingId,
        completeness: req.body.completeness,
        subject_knowledge: req.body.subject_knowledge,
        comments: req.body.comments
    };

    const query = `UPDATE review_scores SET completeness='${rating.completeness}', subject_knowledgem='${rating.subject_knowledge}',
    comments='${rating.comments}' WHERE id = '${rating.id}' AND submission_id='${submissionId}'`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, result: result, status: `rating ${rating.id} updated`});
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const submissionId = req.params.subId;
    const rating = {
        id: req.body.ratingId
    };

    const query = `DELETE FROM review_scores 
    WHERE id = '${rating.id}' AND submission_id='${submissionId} LIMIT 1`;

    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, result: result, status: `rating ${rating.id} deleted`});
    });
});

module.exports = router;