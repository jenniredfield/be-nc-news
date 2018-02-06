const mongoose = require('mongoose');
const Articles = require('../models/articles')
const Comments = require('../models/comments');
const models = require('../models/models')

function updateCommentVote(req,res,next){
    
        const id = req.params.comment_id;
        const query = req.query.vote;
 
       return Comments.findById(id)
            .then(comment => {
             
                return comment.votes;
            })
            .then(newVotes => {
        
                if (query === 'up') {
                    newVotes += 1;
                }
                else newVotes -= 1;
                return Comments.update({_id: id}, {votes: newVotes})
            }).then(() => {
                return Comments.findById(id)
            }).then((comment) => {
          
                    res.send(comment)
            });

}



module.exports = {updateCommentVote, deleteComment, findCommentById, getAllComments};