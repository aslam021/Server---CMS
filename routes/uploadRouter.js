const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const authenticate = require('../authenticate');
const cors = require('./cors');
const db = require('../database/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/submissions');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return cb(new Error('You can upload only image/pdf files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter});

const router = express.Router();

router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported here');
})
.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('submissionFile'), (req, res) => {

    if(req.file != null){
        const submission = {
            subject_id: req.body.subject_id,
            title: req.body.title,
            co_authors: null,
            status: "pending",
            file: "submissions/" + req.file.filename
        };
    
        const query = `INSERT INTO submissions(user_id, subject_id, title, co_authors, status, file)
        VALUES(${req.user.id}, ${submission.subject_id}, '${submission.title}', ${submission.co_authors}, '${submission.status}', '${submission.file}')`;
    
        db.create(query, req, res, (result)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, fileData: req.file, submissionData: result, status: 'inserted'});
        })
    } 
    else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, submissionData: null, status: 'upload failed'});
    }
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported here');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported here');
});

module.exports = router;