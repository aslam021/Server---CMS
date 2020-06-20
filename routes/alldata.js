const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('./cors');
const db = require('../database/db');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

// working with countries table
router.route('/countries')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM countries`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
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
    WHERE code='${country.code}' LIMIT 1`;
    
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


// working with roles table
router.route('/roles')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM roles`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot add a new user role'});
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot update a user role'});
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot delete a user role'});
});


// working with subjects table
router.route('/subjects')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM subjects`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
    const subject = {
        name: req.body.name,
        description: req.body.description
    };
    const query = `INSERT INTO subjects(name, description) 
    VALUES(${subject.name}, ${subject.description})`;
    
    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, subjectData: result, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const subject = {
        id: req.body.subjectId,
        name: req.body.name,
        description: req.body.description
    };
    const query = `UPDATE subjects SET name=${subject.name}, description=${subject.description} 
    WHERE id='${subject.id}' LIMIT 1`;
    
    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, subjectData: result, status: `${subject.id} updated`});
    });
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'cannot delete a subject'});
});


// working with review_scores table
router.route('/review_scores')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM review_scores`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyReviewer, (req, res) => {
    const score = {
        submission_id: req.body.submission_id,
        completeness: req.body.completeness,
        subject_knowledge: req.body.subject_knowledge,
        comments: req.body.comments
    };
    const query = `INSERT INTO review_scores(submission_id, completeness, subject_knowledge, comments) 
    VALUES(${score.submission_id}, ${score.completeness}, ${score.subject_knowledge}, ${score.comments})`;
    
    db.create(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, scoreData: result, status: 'inserted'});
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyReviewer, (req, res, next) => {
    const score = {
        submission_id: req.body.submission_id,
        completeness: req.body.completeness,
        subject_knowledge: req.body.subject_knowledge,
        comments: req.body.comments
    };

    const query = `UPDATE review_scores SET completeness=${score.completeness}, subject_knowledge=${score.subject_knowledge}, comments=${score.comments}
    WHERE submission_id='${score.submission_id}' LIMIT 1`;
    
    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, scoreData: result, status: `updated`});
    });
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'this operation not supported here'});
});


router.route('/review_scores/:submissionId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res) => {
  const query = `SELECT * FROM review_scores WHERE submission_id=${req.params.submissionId}`;
  
  db.read(query, req, res, (result)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({result});
  });

})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'this operation not supported here'});
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyReviewer, (req, res, next) => {
    const score = {
        submission_id: req.params.submissionId,
        completeness: req.body.completeness,
        subject_knowledge: req.body.subject_knowledge,
        comments: req.body.comments
    };

    const query = `UPDATE review_scores SET completeness=${score.completeness}, subject_knowledge=${score.subject_knowledge}, comments=${score.comments}
    WHERE submission_id='${score.submission_id}' LIMIT 1`;
    
    db.update(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, scoreData: result, status: `updated`});
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.varifyAdmin, (req, res, next) => {
    const query = `DELETE FROM review_scores 
    WHERE submission_id = '${req.params.submissionId}' LIMIT 1`;

    db.delete(query, req, res, (result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, ticketData: result, status: 'ticket deleted'});
    });
});


module.exports = router;