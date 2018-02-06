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
            res.json(articles)
        })

}

function getCommentsFromArticle(req, res, next) {

    const id = req.params.article_id;
   return Comments.find({ belongs_to: id})
    .then(comments => {
      
        res.send(comments);
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

module.exports = getAllArticles;