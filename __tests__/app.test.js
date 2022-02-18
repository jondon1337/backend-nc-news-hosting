const request = require("supertest"); //test request for application
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection"); //so we can sever the db when we're finished
const req = require("express/lib/request");

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
              votes: expect.any(Number)
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
  describe('api/articles/:article_id (comment_count)', () => {
    test('should return an article object containing the comment_count', () => {
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
            votes: expect.any(Number)
          })
        );
      });
    });
    test('should return a status 200 when comment counts is zero', () => {
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
            votes: expect.any(Number)
          })
        );
      });
    });
    test('should return a status 404 when wrong path has been passed ', () => {
      return request(app)
      .get("/api/articlesss/2")
      .expect(404)
      .then((response) => {
        const message = {msg: "path not found"}
        expect(response.body).toEqual(message);
      })
    });
    
  });
  describe('api/users', () => {
    test('should return an array of objects, each object should have the following property: username', () => {
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
    test('api/users respons with a status 404 when given an incorrect path', () => {
      return request(app)
      .get("/api/usersss")
      .expect(404)
      .then((response) => {
        const message = { msg: "path not found" };
        expect(response.body).toEqual(message);
      })
    });
  });
  describe('api/articles', () => {
    test('should respond with an articles array of article objects with the author set as the username from the users table, sorted in descending order', () => {
      return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSorted({key: "created_at", descending: true});
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
              votes: expect.any(Number)
            })
          )
        })
      })
    });
    test('api/articles responds with a status 404 when given an incorrect path', () => {
      return request(app)
      .get("/api/articlessss")
      .expect(404)
      .then((response) => {
        const message = { msg: "path not found" };
        expect(response.body).toEqual(message);
      })
    });
    test('api/articles should respond with a status 400 when sortby is not valid ', () => {
      return request(app)
      .get("/api/articles?sort_by=not-valid&order=desc")
      .expect(400)
      .then((response) => {
        const message = { msg: "Bad request"}
        expect(response.body).toEqual(message);
      })
    });
    test('api/articles should respond with a status 400 when order is not valid', () => {
      return request(app)
      .get("/api/articles?sortby=creation_at&order=not-valid")
      .expect(400)
      .then((response) => {
        const message = { msg: "Bad request"}
        expect(response.body).toEqual(message);
      })
    });
  });
});
describe("PATCH", () => {
  describe("PATCH api/articles/:article_id", () => {
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
              votes: 1
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
    test('malformed body / missing required fields, status 400 Bad Request', () => {
      return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then((response) => {
        const message = { msg: "Bad request"}
        expect(response.body).toEqual(message);
      })
    });
    test('incorrect type, inc_votes: "one", status 400: Bad request ', () => {
      return request(app)
      .patch("/api/articles/2")
      .send({inc_votes: "one"})
      .expect(400)
      .then((response) => {
        const message = { msg: "Bad request"}
        expect(response.body).toEqual(message);
      })
    });
  });
});



// sad path passes in string instead of integer status 400 bad request invalid
// if they missed out the property empty object inc_votes isn't there  statuus 400 bad request
// 404 test
