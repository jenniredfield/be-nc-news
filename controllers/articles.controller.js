const Articles = require("../models/articles");
const Comments = require("../models/comments");


function getAllArticles(req, res, next) {

  Articles.find().lean()
    .then((articles) => {
      const commentsCountPromises = articles.map(article => {
        return Comments.count({ belongs_to: article._id });
      });
      return Promise.all([articles, ...commentsCountPromises]);
    })
    .then(([articles, ...commentsCounts]) => {
      articles = articles.map((article, i) => {
        article.comments = commentsCounts[i];
        return article;
      });
      res.json({ articles });
    }).catch(() => {
      next({ statusCode: 500, message: "Unable to retrieve articles, please try again later" });
    });

}


function getCommentsFromArticle(req, res, next) {

  const id = req.params.article_id;
  return Comments.find({ belongs_to: id })
    .then(comments => {

      if (comments.length === 0) return next({ statusCode: 404, message: "Not found" });//valid ID but not found
      res.send({ comments });
    }).catch((error) => {
      if (error.name === "CastError") {
        return next({ statusCode: 400, message: "Invalid ID" });  //receive 400code message sent invalid ID such as 'banana'
      }
      next(error);
    });
}

function postComment(req, res, next) {

  const id = req.params.article_id;

  Articles.findById(id).then(article => {

    if (article === null) next({ statusCode: 404, message: "Article not found, check ID" });
    else if (article.length === 0) next({ statusCode: 404, message: "Article not found, check ID" });
    return id;
  }).then(id => {

    const comment = new Comments({
      body: req.body.comment,
      belongs_to: id
    });

    return comment.save()
      .then(savedComment => {

        res.status(201).send(savedComment);

      })
      .catch(() => {
              
        next({ statusCode: 500, message: "Unable to post comment" });
      });

  });


}

function updateVote(req, res, next) {

  const id = req.params.article_id;
  const query = req.query.vote;
  
  if (req.query.vote === undefined) {
    next({ statusCode: 400, message: "Please provide a valid query, ie vote=up" });
  }

  const querys = ["up", "down"];

  if (!querys.includes(query)) {
    next({ statusCode: 400, message: "Please provide a valid query format,ie vote=up or vote=down" });
  }

  Articles.findById(id)
    .then(article => {
      return article.votes;
    })
    .then(newVotes => {
      if (query === "up") {
        newVotes += 1;
      }
      else newVotes -= 1;
      return Articles.update({ _id: id }, { votes: newVotes });
    })
    .then(() => {

      return Articles.find({ _id: id })
        .then((article) => {

          res.status(202).send({ article });

        });

    }).catch(() => {
      next({ statusCode: 500, message: "Unable to update Vote" });
    });
}

function getArticleById(req, res, next) {
  const id = req.params.article_id;

  return Articles.findById(id)
    .then(article => {
     
      if (article === null) return next({ statusCode: 404, message: "Article Not found, check ID" });
      res.send({ article });
    }).catch(() => {
      next({ statusCode: 500, message: "Unable to retrieve article" });
    });
}


module.exports = { getAllArticles, getCommentsFromArticle, postComment, updateVote, getArticleById };