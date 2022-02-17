const {
  fetchTopics,
  fetchArticleById,
  updateArticleVoteById,
  fetchUsers
} = require("../models/model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const votes = req.body.inc_votes;

  updateArticleVoteById(votes, article_id).then((vote) => {
    res.status(200).send(vote);
  })
  .catch((err) => {
    next(err);
  });
};

exports.getUsers = (req, res, next) => {
  console.log("inside controller")
  fetchUsers()
  .then((users) => {
    res.status(200).send({users:users})
  })
  .catch((err) => {
    next(err);
  });
}
