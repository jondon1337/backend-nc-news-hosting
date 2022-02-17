const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }

      return article;
    });
};

exports.updateArticleVoteById = (articleVoteUpdate, article_id) => {
 
  return db
    .query(
      `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *;`,
      [articleVoteUpdate, article_id],
     
    )
    .then(({ rows }) => {
      console.log(articleVoteUpdate)
      if(!articleVoteUpdate) {
        return Promise.reject({
          status: 400,
          msg: "Bad request"
        });
      }
      return rows[0];
    });
};
