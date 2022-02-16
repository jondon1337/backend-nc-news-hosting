const db = require("../db/connection");

exports.fetchTopics = () => {
    return db
    .query(
        `SELECT * FROM topics;`
    )
    .then((result) => {
        
        return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
    return db
    .query(
        `SELECT * FROM articles WHERE article_id = $1;`, [article_id]
    )
    .then((result) => {
        const id = result.rows[0]
        if(!id) {
            return Promise.reject({
                status: 404,
                msg: "Unknown Id"
            })
        }
        
        return result.rows[0]
    })
};

