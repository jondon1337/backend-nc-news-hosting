const { fetchTopics, fetchArticleById } = require('../models/model');



exports.getTopics = ((req, res, next) => {
    fetchTopics().then((topics) => {
        
        res.status(200).send(({topics: topics}))
    })
    .catch((err) => {
        next(err);
    })
})

exports.getArticleById = ((req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
         
        res.status(200).send({ article })
    })
    .catch((err)=> {
        next(err);
    })
})
