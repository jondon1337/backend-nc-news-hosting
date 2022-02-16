const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json());
const { getTopics, getArticleById } = require('./controllers/controllers');
const { handleCustomErrors,  handlePSQLErrors,  } = require("./controllers/controller-errors/errors")



app.get('/api/topics', getTopics);

app.get("/api/articles/:article_id", getArticleById)


app.use(handleCustomErrors);
app.use(handlePSQLErrors);



app.all('*/', (req, res) => {
    res.status(404).send({ msg: "path not found"})
})


module.exports = app; 