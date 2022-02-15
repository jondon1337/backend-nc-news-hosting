const { fetchTopics } = require('../models/model');

exports.getTopics = ((req, res, next) => {
    fetchTopics().then((topics) => {
        console.log(topics, "Controller!!!!!")
        res.status(200).send(({topics: topics}))
    })
    .catch((err) => {
        console.log(err, "controller error");
    })
})

