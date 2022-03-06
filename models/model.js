const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then((result) => {
      const article = result.rows[0];
    
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return article;
    })
};

exports.updateArticleVoteById = (articleVoteUpdate, article_id) => {
  
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
  sortby = "created_at",
  orderQuery = "DESC",
  topic
  
) => {
  let queryString = `
  SELECT *
  FROM articles
  `
  const queryArray = [];
  const order = orderQuery.toUpperCase()
  const greenList = ["created_at", "title", "topic", "votes"]
 



  if(topic) {
    queryString += ` WHERE topic = $1 `
    queryArray.push(topic)
  } 

  if(!greenList.includes(sortby)) {
    
    return Promise.reject({ status: 400, msg: "Bad request"})
  }
  else{
    queryString += `ORDER BY ${sortby}`
  }
  
  if(order !== "DESC" && order !== "ASC") {
    
    return Promise.reject({ status: 400, msg: "Bad request"})
  }
  else{
    queryString += ` ${order}`
  }
 
queryString += `;`

  return db
    .query(queryString, queryArray) 
    .then((result) => {
      return result.rows;
    })
};

exports.fetchCommentsByArticleId = (article_id) => {
 
  return db
  .query(`
  SELECT comment_id,votes,created_at,author,body FROM comments
  WHERE article_id = $1;
  `, [article_id])
  .then((result) => {
    
    return result.rows
  })
};

exports.checkIfArticleExists = (article_id) => {
  return db
  .query(`
  SELECT * FROM articles
  WHERE article_id = $1;
  `, [article_id])
  .then((result) => {
    if(result.rows.length === 0) {
      return Promise.reject({status:404, msg: "Article not found"})
    }
  })
}

exports.sendCommentByArticleId = (article_id, newPost) => {
  const { username, body } = newPost
   
  if(!username || !body) {
    return Promise.reject({status: 400, msg: "Bad request. invalid path"})
  }

  if(typeof body === "number")
    return Promise.reject({status: 400, msg: "Bad request. invalid path"})

  return db.query(`
  INSERT INTO comments (body, author, article_id)
  VALUES ($1, $2, $3) 
  RETURNING *;`, [body, username, article_id])
  .then(({rows}) => {
    
    return rows[0];
  })
 
}

exports.removeCommentById = (comment_id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1;
    `, [comment_id])
  
}