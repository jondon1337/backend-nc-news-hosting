const express = require('express');
const res = require('express/lib/response');
const app = express();

app.use(express.json());

const { getTopics, getUsers, getArticles, getArticleById, patchArticleById, patchCommentById, getCommentsByArticleId, postCommentByArticleId, deleteCommentByCommentId } = require('./controllers/controllers');
const { handleCustomErrors,  handlePSQLErrors, handle500s} = require("./controllers/controller-errors/errors")



app.get("/api/topics", getTopics);  //done
app.get("/api/users", getUsers);  //done
app.get("/api/articles", getArticles);  //done
app.get("/api/articles/:article_id", getArticleById);  //done
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)  //done
app.patch("/api/articles/:article_id", patchArticleById); //done
app.patch("/api/comments/:comment_id", patchCommentById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId); //done
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);



app.all('*/', (req, res) => {
    res.status(404).send({ msg: "path not found"})
})


module.exports = app; 