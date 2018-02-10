const mongoose = require('mongoose');
const Articles = require('../models/articles')
const Comments = require('../models/comments');
const models = require('../models/models')

function updateCommentVote(req, res, next) {

    const id = req.params.comment_id;
    const query = req.query.vote;

    if (req.query.vote === undefined) {
        next({ statusCode: 400, message: "Please provide a valid query, ie vote=up" })
    }

    const querys = ["up", "down"]

    if (!querys.includes(query)) {
        next({ statusCode: 400, message: "Please provide a valid query format,ie vote=up or vote=down" })
    }


    return Comments.findById(id)
        .then(comment => {

            return comment.votes;
        })
        .then(newVotes => {

            if (query === 'up') {
                newVotes += 1;
            }
            else newVotes -= 1;
            return Comments.update({ _id: id }, { votes: newVotes })
        }).then(() => {
            return Comments.findById(id)
        }).then((comment) => {

            res.status(202).send(comment)
        }).catch((error)=> {
            next({ statusCode: 500, message: "Unable to update Vote" })
        })

}


function deleteComment(req, res, next) {

    const id = req.params.comment_id;

    Comments.findById(id)
        .then(comment => {
            if(comment === null) { return next({statusCode: 500, message: "Unable to find comment to delete, check ID"})};
            if (comment.created_by === 'northcoder')
                return Comments.findByIdAndRemove(id)

        }).then(comment => {

            res.status(202).send(comment);
        }).catch((error)=> {
            next({ statusCode: 500, message: "Unable to delete comment" });
        })


}

function findCommentById(req, res, next) {

    const id = req.params.comment_id;

    return Comments.findById(id)
        .then(comment => {

            if(comment === null) { return next({statusCode: 500, message: "Unable to find comment, check ID"})}
            res.send(comment);
        }).catch((error) => {
            next({statusCode: 500, message: "Unable to find comment"})
        })

}

function getAllComments(req, res, next) {


    return Comments.find()
        .then(comments => {

            res.send(comments);
        }).catch((error)=> {
            next(error);
        });

}


module.exports = { updateCommentVote, deleteComment, findCommentById, getAllComments };