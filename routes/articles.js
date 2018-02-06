const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const articlesRouter = require('express').Router();
const { getAllArticles, getCommentsFromArticle, postComment, updateVote, getArticleById } = require('../controllers/articles.controller')

articlesRouter.route('/')
    .get(getAllArticles);


module.exports = articlesRouter;