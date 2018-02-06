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

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/users', usersRouter)


module.exports = apiRouter;