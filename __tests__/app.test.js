const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
beforeEach(() => {
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
                console.log(response.body, "test!!!!!!!!!!!!!!")
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
                console.log(response.body, "test!!!!!!!!!!!!!!")
                const message = { msg: "path not found"};
                expect(response.body).toEqual(message)
            })
            
        })
    });
});