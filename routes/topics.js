const topicsRouter = require("express").Router();
const mongoose = require("mongoose");
const {getAllTopics, getArticlesByTopic} = require("../controllers/topics.controller");


topicsRouter.route("/")
  .get(getAllTopics);

topicsRouter.route("/:topic/articles")
  .get(getArticlesByTopic);
    
module.exports = topicsRouter;