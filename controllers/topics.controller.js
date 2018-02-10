const mongoose = require('mongoose');
const Topics = require('../models/topics');
const Articles = require('../models/articles')
const Comments = require('../models/comments')

function getAllTopics(req,res,next) {

    Topics.find()
    .then((topics)=>{
        
        
        res.send({topics});
    })
    .catch((error)=>{
        next(error);
    })

}


function getArticlesByTopicId(req,res,next){

    const topic = req.params.topic;
  
    return Articles.find({belongs_to : topic}).lean()
    .then((articles) => {
            if(articles.length === 0) { return next({statusCode: 404, message: "Unable to find topic name"})}
            const commentsCount = articles.map(article => {
                return Comments.count({belongs_to: article._id})
            })
            return Promise.all([articles, ...commentsCount])
            .then(([articles, ...commentsCount])=> {
             
               articles = articles.map((article, i ) => {
                    article.comments = commentsCount[i];
                    return article;
                })
               
                res.send({articles});
            })
          
    })
    .catch((error)=> {
        next(error);
    });
}

module.exports = {getAllTopics, getArticlesByTopicId};