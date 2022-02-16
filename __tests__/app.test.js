const request = require("supertest");//test request for application
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed")
const db = require("../db/connection"); //so we can sever the db when we're finished
const req = require("express/lib/request");

beforeEach(() => {  //async wait for these to finish/return
    return seed(data);
})


afterAll (() => {
  return db.end()
})

describe.only('api/topics', () => {
    describe('GET', () => {
        test('should respond with an array of topic objects, each of which should have the following properties:slug, description', () => {
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
                    )
                })
            })
            
        });
        test("api/topics responds with error 404 when wrong path been passed", () => {
            return request(app)
            .get("/api/topiccsss")
            .expect(404)
            .then((response) => {
                
                const message = { msg: "path not found"};
                expect(response.body).toEqual(message)
            })
        });
    });
    describe('/api/articles/:article_id', () => {
        test('status 200 - responds with a specific article object', () => {
            return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then((response) => {
               
                expect(response.body.article).toEqual(expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                }))
            })
        });
        test('should respond with status: 400 invalid data type for an invalid id ', () => {
            return request(app)
            .get("/api/articles/not_a_valid_id")
            .expect(400)
            .then(({ body: {msg} }) => {
                expect(msg).toBe("Bad request")
            })
        });
        test('should respond with status: 404 when a valid request is made but id does not exist  ', () => {
            return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body: {msg} }) => {
                expect(msg).toBe("Unknown Id")
            })
        });
    });
});
