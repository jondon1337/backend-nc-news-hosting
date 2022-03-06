const {
  fetchTopics,
  fetchArticleById,
  updateArticleVoteById,
  fetchUsers,
  fetchArticles, 
  fetchCommentsByArticleId,
  checkIfArticleExists,
  sendCommentByArticleId,
  removeCommentById
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
  fetchUsers()
  .then((users) => {
    res.status(200).send({ users:users })
    
  })
  .catch((err) => {
    next(err);
  });
}

exports.getArticles = (req, res, next) => {
  const sortby = req.query.sortby
  const order = req.query.order
  const topic = req.query.topic

  fetchArticles(sortby, order, topic)
  .then((articles) => {
    
    res.status(200).send({ articles: articles })
  })
  .catch((err) => {
    next(err);
  })
}

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([ fetchCommentsByArticleId(article_id), checkIfArticleExists(article_id)])
  .then(([comment]) => {
    res.status(200).send({ comment: comment }) 
    
  })
  .catch((err) => {
    next(err);
  })
}

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const newPost  = req.body;

  sendCommentByArticleId( article_id, newPost)
    .then((comment) => {
      res.status(201).send({comment: comment})
      
    })
    .catch((err) => {
      
      next(err);
    })
}

exports.deleteCommentByCommentId = (req, res, next) => {
  const comment_id = req.params.comment_id
  
  removeCommentById(comment_id)
    .then(() => {    
      res.status(204).send(`comment id:${comment_id} deleted`)
        
    })
    .catch((err) => {
      next(err);
    });
};