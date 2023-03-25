const testUserData = require("../db/data/test/users");
const { db } = require("../db/connection");
const seed = require("../seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testUserData));

afterAll(() => db.close());

describe("/users", () => {
  it("GET:200 should return an array of users", () => {
    return request(app)
      .get("/users")
      .expect(200)
      .then((data) => {
        console.log(Object.keys(data));
      });
  });
});
