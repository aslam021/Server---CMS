var express = require('express');
var router = express.Router();

const authenticate = require('../authenticate');

router.route('/')
.get((req, res, next)=>{

})
.post(authenticate.verifyUser, (req, res, next)=>{
    
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported here');
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});


router.route('/:articleId')
.get((req, res, next)=>{

})
.post((req, res, next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported here');    
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});


router.route('/:articleId/comments')
.get((req, res, next)=>{

})
.post(authenticate.verifyUser, (req, res, next)=>{
    
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported here');
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});


router.route('/:articleId/comments/:commentId')
.get((req, res, next)=>{

})
.post((req, res, next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported here');    
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});

module.exports = router;