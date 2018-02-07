const mongoose = require('mongoose');
const Articles = require('../models/articles')
const Comments = require('../models/comments');
const models = require('../models/models')

function getAllArticles(req,res,next){

    Articles.find().lean()
        .then((articles)=>{
            const commentsCountPromises = articles.map(article => {
                return Comments.count({ belongs_to: article._id });
            })
            return Promise.all([articles, ...commentsCountPromises])
        })
        .then(([articles, ...commentsCounts]) => {
            articles = articles.map((article, i) => {
                article.comments = commentsCounts[i]
                return article;
            })
          
            res.json({articles})
        })

}

function getCommentsFromArticle(req, res, next) {

    const id = req.params.article_id;
   return Comments.find({ belongs_to: id})
    .then(comments => {
      
        res.send({comments});
    })
}

function postComment(req, res, next){
  
    const id = req.params.article_id;

    const comment = new Comments( {
        body: req.body.comment,
        belongs_to: id
      });
      

    return comment.save()
    .then(savedComment => {
        
        res.send(savedComment)
        
    })
    .catch(console.error)
}

function updateVote(req, res, next) {
    
    const id = req.params.article_id;
    const query = req.query.vote;

    Articles.findById(id)
        .then(article => {
            return article.votes;
        })
        .then(newVotes => {
            if (query === 'up') {
                newVotes += 1;
            }
            else newVotes -= 1;
           return Articles.update({_id: id}, {votes: newVotes})
        })
        .then(() => {
       
            return Articles.find({_id : id})
            .then((article) => {
                console.log(article)
                res.send({article})

            })
         
        })
}

function getArticleById(req,res,next){
    const id = req.params.article_id;

    return Articles.findById(id)
    .then(article =>{

         res.send({article});
    })
}


module.exports = { getAllArticles, getCommentsFromArticle, postComment, updateVote, getArticleById };