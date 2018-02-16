const articlesRouter = require("express").Router();
const { getAllArticles, getCommentsFromArticle, postComment, updateVote, getArticleById } = require("../controllers/articles.controller");

articlesRouter.route("/")
  .get(getAllArticles);

articlesRouter.route("/:article_id/comments")
  .get(getCommentsFromArticle)
  .post(postComment);

articlesRouter.route("/:article_id")
  .put(updateVote)
  .get(getArticleById);

module.exports = articlesRouter;