const request = require("supertest"); //test request for application
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection"); //so we can sever the db when we're finished
const req = require("express/lib/request");
const { response } = require("../app");

beforeEach(() => {
  //async wait for these to finish/return
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("api/topics", () => {
  describe("GET", () => {
    test("should respond with an array of topic objects, each of which should have the following properties:slug, description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics).toBeInstanceOf(Array);
          expect(response.body.topics.length).toBeGreaterThan(0);
          response.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("api/topics responds with error 404 when wrong path been passed", () => {
      return request(app)
        .get("/api/topiccsss")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("status 200 - responds with a specific article object", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String), //change to the specific values
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("should respond with status: 400 invalid data type for an invalid id ", () => {
      return request(app)
        .get("/api/articles/not_a_valid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with status: 404 when a valid request is made but id does not exist  ", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
  });
  describe("api/articles/:article_id (comment_count)", () => {
    test("should return an article object containing the comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              comment_count: 11,
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("should return a status 200 when comment counts is zero", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 2,
              title: expect.any(String),
              topic: expect.any(String),
              comment_count: 0,
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("should return a status 404 when wrong path has been passed ", () => {
      return request(app)
        .get("/api/articlesss/2")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    describe("api/articles/:article_id/comments", () => {
      test("should return an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toBeInstanceOf(Array);
            response.body.comment.forEach((comments) => {
              expect(comments).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("should respond with an empty array when article_id has no comments status 200", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toEqual([]);
          });
      });
      test("should respond with status 404 if article doesn't exist", () => {
        return request(app)
          .get("/api/articles/2222/comments")
          .expect(404)
          .then((response) => {
            const message = { msg: "Article not found" };
            expect(response.body).toEqual(message);
          });
      });
    });
  });
  describe("api/users", () => {
    test("should return an array of objects, each object should have the following property: username", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users).toBeInstanceOf(Array);
          expect(response.body.users.length).toBeGreaterThan(0);
          response.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("api/users respons with a status 404 when given an incorrect path", () => {
      return request(app)
        .get("/api/usersss")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
  });
  describe("api/articles", () => {
    test("should respond with an articles array of article objects with the author set as the username from the users table, sorted in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
          expect(response.body.articles).toBeInstanceOf(Array);
          expect(response.body.articles.length).toBeGreaterThan(0);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("api/articles responds with a status 404 when given an incorrect path", () => {
      return request(app)
        .get("/api/articlessss")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("api/articles should respond with a status 400 when sortby is not valid ", () => {
      return request(app)
        .get("/api/articles?sortby=not-valid&order=desc")
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
    test("api/articles should respond with a status 400 when order is not valid", () => {
      return request(app)
        .get("/api/articles?sortby=creation_at&order=not-valid")
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
  });

  describe("GET /api/articles (queries)", () => {
    test("the end point should also accept the following queries: sort_by: which sorts the articles by any valid column (defaults to date), order: which can be set to `asc` or `desc` for ascending or descending (defaults to descending), topic: which filters the articles by the topic value specified in the query", () => {
      return request(app)
        .get("/api/articles?sortby=title&order=desc&topic=cats")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSorted({
            key: "title",
            descending: true,
          });
          expect(response.body.articles).toBeInstanceOf(Array);
          expect(response.body.articles.length).toBeGreaterThan(0);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: "cats",
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("api/articles responds with a status 404 when given an incorrect path", () => {
      return request(app)
        .get("/api/articlessss?sortby=title&order=desc&topic=cats")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("api/articles should respond with a status 400 when sortby is not valid ", () => {
      return request(app)
        .get("/api/articles?sortby=not-valid&order=desc&topic=cats")
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
    test("api/articles should respond with a status 400 when order is not valid", () => {
      return request(app)
        .get("/api/articles?sortby=created_at&order=not-valid&topic=cats")
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
    //test.only("api/articles should respond with a status 400 when topic is not valid", () => {
    //return request(app)
    //.get("/api/articles?sortby=created_at&order=desc&topic=not_valid_topic")
    //.expect(400)
    // .then((response) => {
    //const message = { msg: "Bad request" };
    //expect(response.body).toEqual(message);
    //});
    //});
    test("should respond with an empty array when topic has no articles associated with it status 200", () => {
      return request(app)
        .get("/api/articles?sortby=title&order=desc&topic=paper")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([]);
        });
    });
  });
});

describe("PATCH", () => {
  describe("api/articles/:article_id", () => {
    test("should respond with a status: 200 ", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              article_id: 2,
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: 1,
            })
          );
        });
    });
    test("api/articles/wrong endpoint responds with error 404 when wrong path been passed", () => {
      return request(app)
        .patch("/api/articlesssss/2")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("malformed body / missing required fields, status 400 Bad Request", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
    test('incorrect type, inc_votes: "one", status 400: Bad request ', () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "one" })
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
  });
});

describe("PATCH", () => {
  describe("api/comments/:comment_id", () => {
    test("should respond with a status: 200 ", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              article_id: 1,
              author: expect.any(String),
              body: expect.any(String),
              comment_id: 2,
              created_at: expect.any(String),
              votes: 15,
            })
          );
        });
    });
    test("api/comments/wrong endpoint responds with error 404 when wrong path been passed", () => {
      return request(app)
        .patch("/api/commentsssss/2")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("malformed body / missing required fields, status 400 Bad Request", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({})
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
    test('incorrect type, inc_votes: "one", status 400: Bad request ', () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "one" })
        .expect(400)
        .then((response) => {
          const message = { msg: "Bad request" };
          expect(response.body).toEqual(message);
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("an object with the following properties:username, body. Responds with: the posted comment", () => {
      const newPost = {
        username: "butter_bridge",
        body: "this is a comment",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newPost)
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toEqual(
            expect.objectContaining({
              article_id: 1,
              author: "butter_bridge",
              body: "this is a comment",
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("api/comments/:article_id/comments responds with a status 404 when given an incorrect path", () => {
      return request(app)
        .post("/api/carticlleess/1/comments")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("should respond with status: 400 invalid data type for an invalid id ", () => {
      return request(app)
        .post("/api/articles/not_a_valid_id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request. invalid path");
        });
    });
    test("should respond with status: 400 failing schema validation", () => {
      const newPost = {
        username: "butter_bridge",
        body: 1,
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newPost)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request. invalid path");
        });
    });
    test("should respond with status: 400 malformed body / missing required fields: ", () => {
      const newPost = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(newPost)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request. invalid path");
        });
    });
  });
});

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    test("should delete the given comment by comment_id", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("api/comments/:comment_id responds with a status 404 when given an incorrect path", () => {
      return request(app)
        .delete("/api/commentssss/1")
        .expect(404)
        .then((response) => {
          const message = { msg: "path not found" };
          expect(response.body).toEqual(message);
        });
    });
    test("should respond with status: 400 invalid data type for an invalid id ", () => {
      return request(app)
        .delete("/api/comments/not_a_valid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });

    test("should respond with status: 404 when a valid request is made but id does not exist  ", () => {
      return request(app)
        .get("/api/comments/99999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("path not found");
        });
    });
  });
});

// sad path passes in string instead of integer status 400 bad request invalid
// if they missed out the property empty object inc_votes isn't there  statuus 400 bad request
// 404 test
