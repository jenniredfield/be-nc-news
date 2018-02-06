var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const topicsRouter = require('express').Router();
const {getAllTopics, getArticlesByTopicId} = require('../controllers/topics.controller')


topicsRouter.route('/')
    .get(getAllTopics);

topicsRouter.route('/:topic/articles')
    .get(getArticlesByTopicId);
    
module.exports = topicsRouter;