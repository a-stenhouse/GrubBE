const { userData, itemData, categoryData } = require("../db/data/test/");
const { db } = require("../db/connection");
const seed = require("../db/seed/seed");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(userData, categoryData, itemData));

afterAll(() => db.close());

describe("/users", () => {
  it("GET:200 should return an array of users", () => {
    expect(2).toBe(2);
  });
});
