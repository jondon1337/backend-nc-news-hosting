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
  console.log(articleVoteUpdate, article_id);
  return db
    .query(
      `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *;`,
      [articleVoteUpdate, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = (
  sort_by = "created_at",
  orderQuery = "DESC"
  
) => {
  const order = orderQuery.toUpperCase()
  const greenList = ["created_at", "topic", "votes"]

  if(!greenList.includes(sort_by) ) {
    console.log("bad sortby")
    return Promise.reject({ status: 400, msg: "Bad request"})
  }
  
  if(order !== "DESC" && order !== "ASC") {
    console.log("bad order")
    return Promise.reject({ status: 400, msg: "Bad request"})
  }
 
 
  let queryCreationTime =    `
  SELECT *
  FROM articles
  ORDER BY created_at DESC;
  `;
  return db
    .query(queryCreationTime)
    .then((result) => {
      
      return result.rows;
    });
};
