var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const commentsRouter = require('express').Router();
const {updateCommentVote, deleteComment, findCommentById, getAllComments} = require('../controllers/comments.controller');

commentsRouter.route('/')
    .get(getAllComments);

commentsRouter.route('/:comment_id')
    .put(updateCommentVote)
    .delete(deleteComment)
    

commentsRouter.route('/:comment_id')
    .get(findCommentById);

module.exports = commentsRouter;