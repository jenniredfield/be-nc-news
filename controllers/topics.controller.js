const mongoose = require('mongoose');
const Topics = require('../models/topics');
const Articles = require('../models/articles')
const Comments = require('../models/comments')

function getAllTopics(req,res,next) {

    Topics.find()
    .then((topics)=>{
        res.send(topics);
    })
    .catch(console.error)

}
