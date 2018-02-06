var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');

apiRouter.route('/')
.get((req,res,next) => {

    res.send('Connected to Backend NC News!!');
});