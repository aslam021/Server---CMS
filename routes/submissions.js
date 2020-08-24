const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    //this user's submission
    const user_id = req.user.id;
    
    const query = `SELECT * FROM submissions WHERE user_id='${user_id}'`;

    db.read(query, req, res, (submissions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({submissions});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, submissionData: null, status: 'to upload a file use API: /uploadFile'});
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

router.route('/latest')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next) => {

    const query = `SELECT * FROM submissions ORDER BY (createdAt) DESC LIMIT 25`;

    db.read(query, req, res, (data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, result: data, status: 'Conference details are sorted by date'});
    });
})

router.route('/conference/:confId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
    //this will return all submission for this conference.
    const confId = req.params.confId;
    
    const query = `SELECT * FROM submissions WHERE id BETWEEN ${(confId-1)*50+1} AND ${confId*50}`;

    db.read(query, req, res, (submissions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({submissions});
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, submissionData: null, status: 'to upload a file use API: /uploadFile'});
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
    const query = `SELECT * FROM submissions WHERE id='${req.params.submissionId}' LIMIT 1`;

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
        co_authors: req.body.co_authors
    };

    if(!submission.co_authors){
        submission.co_authors = null;
    }

    if (submission.subject_id == null || submission.title == null){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Please do request with subject_id, title values'});
    } 
    else {
        const query = `UPDATE submissions SET subject_id=${submission.subject_id}, 
        title='${submission.title}', co_authors=${submission.co_authors}
        WHERE id=${req.params.submissionId} AND user_id=${req.user.id} LIMIT 1`;

        db.update(query, req, res, (result)=>{
            res.setHeader('Content-Type', 'application/json');
            if(result.affectedRows == 0){
                res.statusCode = 403;
                res.json({success: false, submissionData: result, 
                    status: `You may not the author of this submission or there are no submission in the id ${req.params.submissionId}`});
            } else {
                res.statusCode = 200;
                res.json({success: true, submissionData: result, status: 'submission updated'});
            }
        })
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    let query = `DELETE FROM submissions WHERE id=${req.params.submissionId} AND user_id=${req.user.id} LIMIT 1`

    //admin can delete any submission
    // if(authenticate.isAdmin()){
    //     query = `DELETE FROM submissions WHERE id=${req.params.submissionId}`
    // }

    db.delete(query, req, res, (result)=>{

        if(result.affectedRows == 0 ){
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: "You need admin privilages to delete others' submissions"});
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, submissionData: result, status: 'delete request success'});
        }
    })
});


//get or update submission status
router.route('/status/:submissionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res) => {
    const query = `SELECT status FROM submissions WHERE id='${req.params.submissionId} LIMIT 1'`;

    db.read(query, req, res, (submission) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({submission});
    });
})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'post operation is not supported here'});
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
    const submissionId = req.params.submissionId;
    const status = req.body.status;

    if (status === 'rejected' || status === 'approved') {
        const query = `UPDATE submissions SET status='${status}' WHERE id='${submissionId}' LIMIT 1` 
        
        db.update(query, req, res, (result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({result});
        });
    }
    else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'allowed values for status are only rejected and approved'});
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'delete operation is not supported here'});
});


module.exports = router;