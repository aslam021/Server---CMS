var express = require('express');
var router = express.Router();

const authenticate = require('../authenticate');

router.route('/')
.get((req, res, next)=>{

})
.post(authenticate.verifyUser, (req, res, next)=>{
    
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});

module.exports = router;