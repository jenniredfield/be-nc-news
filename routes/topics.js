const topicsRouter = require("express").Router();
const {getAllTopics, getArticlesByTopic} = require("../controllers/topics.controller");

topicsRouter.route("/")
  .get(getAllTopics);

topicsRouter.route("/:topic/articles")
  .get(getArticlesByTopic);
    
module.exports = topicsRouter;