var express = require('express');
var speakersRouter = express.Router();

const authenticate = require('../authenticate');

speakersRouter.route('/')
.get((req, res, next)=>{

})
.post(authenticate.verifyUser, (req, res, next)=>{
    
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    
});

module.exports = speakersRouter;